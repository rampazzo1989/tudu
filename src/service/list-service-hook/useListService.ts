import {useRecoilState} from 'recoil';
import {
  ListViewModel,
  TuduViewModel,
  List,
  ListOrigin,
  ListDataViewModel,
  TuduItem,
} from '../../scenes/home/types';
import {
  myLists,
  archivedLists as archivedListsState,
  unlistedTudus as unlistedTudusState,
  UNLISTED,
  tudus as tudusState,
  archivedTudus as archivedTudusState,
} from '../../scenes/home/state';
import {ItemNotFoundError} from '../errors/item-not-found-error';
import {useCallback} from 'react';
import {groupBy} from '../../utils/array-utils';

const useListService = () => {
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const [customTudus, setCustomTudus] = useRecoilState(tudusState);
  const [archivedLists, setArchivedLists] = useRecoilState(archivedListsState);
  const [archivedTudus, setArchivedTudus] = useRecoilState(archivedTudusState);
  const [unlistedTudus, setUnlistedTudus] = useRecoilState(unlistedTudusState);

  const getListState = useCallback(
    (stateOrigin: ListOrigin) =>
      stateOrigin === 'default' ? customLists : archivedLists,
    [customLists, archivedLists],
  );

  const getTudusState = useCallback(
    (stateOrigin: ListOrigin) =>
      stateOrigin === 'default' ? customTudus : archivedTudus,
    [customTudus, archivedTudus],
  );

  const getStateSetter = useCallback(
    (stateOrigin: ListOrigin) =>
      stateOrigin === 'default' ? setCustomLists : setArchivedLists,
    [setCustomLists, setArchivedLists],
  );

  const getTudusStateSetter = useCallback(
    (stateOrigin: ListOrigin) =>
      stateOrigin === 'default' ? setCustomTudus : setArchivedTudus,
    [setCustomTudus, setArchivedTudus],
  );

  const getAllLists = useCallback(
    (origin: ListOrigin = 'default'): ListDataViewModel[] | undefined => {
      const listState = getListState(origin);
      if (
        !listState ||
        (Object.keys(listState).length === 0 &&
          listState.constructor === Object)
      ) {
        return;
      }

      const linkedLists = [...listState].map<ListDataViewModel>(
        ([listId, value]) => {
          const tudus = customTudus.get(listId);
          const numberOfActiveItems = [...(tudus ?? [])].filter(
            ([_, tudu]) => !tudu.done,
          ).length;
          return {
            id: value.id,
            label: value.label,
            color: value.color,
            groupName: value.groupName,
            origin,
            numberOfActiveItems,
          };
        },
      );
      return linkedLists;
    },
    [customTudus, getListState],
  );

  const saveAllLists = useCallback(
    (newLists: ListDataViewModel[], origin: ListOrigin = 'default') => {
      const lists = newLists.map<[string, List]>(x => {
        return [x.id, x];
      });
      const newMap = new Map<string, List>(lists);

      const stateSetter = getStateSetter(origin);

      stateSetter(newMap);
    },
    [getStateSetter],
  );

  const getListById = useCallback(
    (id: string, origin: ListOrigin = 'default') => {
      const listState = getListState(origin);

      if (!listState.has(id)) {
        return;
      }
      const foundList = listState.get(id)!;

      const foundTudus = getTudusState(origin).get(id);

      const linkedList = new ListViewModel(foundList, foundTudus, origin);
      return linkedList;
    },
    [getListState, getTudusState],
  );

  const getTuduById = useCallback(
    (id: string, listId: string, origin: ListOrigin = 'default') => {
      const tudus = getTudusState(origin);
      const foundTudus = tudus.get(listId);

      if (!foundTudus?.has(id)) {
        throw new ItemNotFoundError("The tudu id couldn't be found.", {
          listId: listId,
          tuduId: id,
          origin,
        });
      }

      const foundTudu = foundTudus.get(id)!;
      const linkedTudu = new TuduViewModel(foundTudu, listId, origin);

      return linkedTudu;
    },
    [getTudusState],
  );

  const saveUnlistedTudus = useCallback(
    (tudus: TuduViewModel[]) => {
      setUnlistedTudus(previousState => {
        const newTuduMap = new Map(previousState);

        tudus.forEach(tudu => {
          newTuduMap.set(tudu.id, tudu.mapBack());
        });

        return newTuduMap;
      });
    },
    [setUnlistedTudus],
  );

  const saveTudu = useCallback(
    (tudu: TuduViewModel) => {
      if (tudu.listId === UNLISTED) {
        return saveUnlistedTudus([tudu]);
      }
      const tudusStateSetter = getTudusStateSetter(tudu.origin);

      tudusStateSetter(previousState => {
        const foundTuduMap =
          previousState.get(tudu.listId) ?? new Map<string, TuduItem>();
        const newTuduMap = new Map(foundTuduMap);
        newTuduMap.set(tudu.id, tudu.mapBack());

        const newState = new Map([...previousState]);
        newState.set(tudu.listId, newTuduMap);

        return newState;
      });
    },
    [getTudusStateSetter, saveUnlistedTudus],
  );

  const saveAllTudus = useCallback(
    (tudus: TuduViewModel[], origin: ListOrigin = 'default') => {
      const unlistedTudusVMs = tudus.filter(x => x.listId === UNLISTED);

      if (unlistedTudusVMs) {
        saveUnlistedTudus(unlistedTudusVMs);
      }

      const groupedTudus = groupBy(
        tudus.filter(x => x.listId !== UNLISTED),
        tudu => tudu.listId,
      );

      const tudusStateSetter = getTudusStateSetter(origin);

      tudusStateSetter(previousState => {
        const newState = new Map(previousState);

        for (const listId in groupedTudus) {
          const foundTuduMap =
            previousState.get(listId) ?? new Map<string, TuduItem>();

          const newTuduMap = new Map(foundTuduMap);
          const savingTudus = groupedTudus[listId];

          savingTudus.forEach(tudu => {
            newTuduMap.set(tudu.id, tudu.mapBack());
          });

          newState.set(listId, newTuduMap);
        }

        return newState;
      });
    },
    [getTudusStateSetter, saveUnlistedTudus],
  );

  const getAllTudus = useCallback(
    (origin: ListOrigin = 'default') => {
      const state = getTudusState(origin);
      const listState = getListState(origin);
      const allTudus =
        [...state].flatMap(([listId, tudus]) => {
          const listName = listState.get(listId)?.label;
          console.log(listName);
          return [...tudus].map(
            ([_, tudu]) => new TuduViewModel(tudu, listId, origin, listName),
          );
        }) ?? [];
      const unlisted = [...unlistedTudus].map(
        ([_, tudu]) => new TuduViewModel(tudu, UNLISTED),
      );
      return allTudus.concat(unlisted);
    },
    [getListState, getTudusState, unlistedTudus],
  );

  const getAllUndoneTudus = useCallback(
    (origin: ListOrigin = 'default') => {
      const state = getTudusState(origin);
      const listState = getListState(origin);
      const allTudus =
        [...state].flatMap(([listId, tudus]) => {
          const listName = listState.get(listId)?.label;
          return [...tudus]
            .filter(([_, tudu]) => !tudu.done)
            .map(
              ([_, tudu]) => new TuduViewModel(tudu, listId, origin, listName),
            );
        }) ?? [];
      const unlisted = [...unlistedTudus]
        .filter(([_, tudu]) => !tudu.done)
        .map(([_, tudu]) => new TuduViewModel(tudu, UNLISTED));
      return allTudus.concat(unlisted);
    },
    [getListState, getTudusState, unlistedTudus],
  );

  const saveList = useCallback(
    (list: ListViewModel) => {
      const listStateSetter = getStateSetter(list.origin);

      listStateSetter(previousState => {
        const newState = new Map([...previousState]);
        newState.set(list.id, list.mapBackList());

        return newState;
      });
    },
    [getStateSetter],
  );

  const saveListAndTudus = useCallback(
    (list: ListViewModel) => {
      const listStateSetter = getStateSetter(list.origin);
      const tudusStateSetter = getTudusStateSetter(list.origin);

      listStateSetter(previousState => {
        const newState = new Map([...previousState]);
        newState.set(list.id, list.mapBackList());

        return newState;
      });

      tudusStateSetter(previousState => {
        const newState = new Map(previousState);
        newState.set(list.id, list.mapBackTudus());

        return newState;
      });
    },
    [getStateSetter, getTudusStateSetter],
  );

  const deleteList = useCallback(
    (list: ListDataViewModel) => {
      const listStateSetter = getStateSetter(list.origin);
      const tudusStateSetter = getTudusStateSetter(list.origin);

      listStateSetter(previousState => {
        const newState = new Map(previousState);
        newState.delete(list.id);

        return newState;
      });

      tudusStateSetter(previousState => {
        const newState = new Map(previousState);
        newState.delete(list.id);

        return newState;
      });
    },
    [getStateSetter, getTudusStateSetter],
  );

  const archiveList = useCallback(
    (list: ListDataViewModel) => {
      const foundList = customLists.has(list.id);
      if (!foundList) {
        throw new ItemNotFoundError("The list couldn't be found.", list);
      }

      setArchivedLists(previousState => {
        const newState = new Map(previousState);
        newState.set(list.id, list);

        return newState;
      });

      setArchivedTudus(previousState => {
        const tudus = previousState.get(list.id);
        if (!tudus) {
          return previousState;
        }
        const newState = new Map(previousState);
        newState.set(list.id, tudus);

        return newState;
      });

      setCustomLists(previousState => {
        const newState = new Map(previousState);
        newState.delete(list.id);

        return newState;
      });

      setCustomTudus(previousState => {
        const newState = new Map(previousState);
        newState.delete(list.id);

        return newState;
      });
    },
    [
      customLists,
      setArchivedLists,
      setArchivedTudus,
      setCustomLists,
      setCustomTudus,
    ],
  );

  const unarchiveList = useCallback(
    (list: ListViewModel) => {
      const foundList = archivedLists.has(list.id);
      if (!foundList) {
        throw new ItemNotFoundError("The list couldn't be found.", list);
      }

      setCustomLists(previousState => {
        const newState = new Map(previousState);
        newState.set(list.id, list.mapBackList());

        return newState;
      });

      setCustomTudus(previousState => {
        const newState = new Map(previousState);
        newState.set(list.id, list.mapBackTudus());

        return newState;
      });

      setArchivedLists(previousState => {
        const newState = new Map(previousState);
        newState.delete(list.id);

        return newState;
      });

      setArchivedTudus(previousState => {
        const newState = new Map(previousState);
        newState.delete(list.id);

        return newState;
      });
    },
    [
      archivedLists,
      setCustomLists,
      setCustomTudus,
      setArchivedLists,
      setArchivedTudus,
    ],
  );

  return {
    getAllLists,
    saveAllLists,
    getListById,
    getAllTudus,
    getAllUndoneTudus,
    getTuduById,
    saveTudu,
    saveAllTudus,
    saveList,
    saveListAndTudus,
    deleteList,
    archiveList,
    unarchiveList,
  };
};

export {useListService};
