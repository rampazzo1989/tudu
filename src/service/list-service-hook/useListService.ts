import {SetterOrUpdater, useRecoilState, useSetRecoilState} from 'recoil';
import {
  ListViewModel,
  TuduViewModel,
  List,
  ListOrigin,
  ListDataViewModel,
  TuduItem,
  StateBackup,
  TuduItemMap,
} from '../../scenes/home/types';
import {
  myLists,
  archivedLists as archivedListsState,
  unlistedTudus as unlistedTudusState,
  UNLISTED_LIST_ID,
  tudus as tudusState,
  archivedTudus as archivedTudusState,
} from '../../scenes/home/state';
import {ItemNotFoundError} from '../errors/item-not-found-error';
import {useCallback, useEffect} from 'react';
import {groupBy} from '../../utils/array-utils';
import {getListFromViewModel} from '../../utils/list-and-group-utils';
import { getDateOnlyTimeStamp, isOutdated } from '../../utils/date-utils';
import { recalculateRecurrence } from '../../state/atoms';

class SingletonBackup {
  private static instance: SingletonBackup;

  public backup?: StateBackup = undefined;

  private constructor() {}

  public static getInstance(): SingletonBackup {
    if (!SingletonBackup.instance) {
      SingletonBackup.instance = new SingletonBackup();
    }

    return SingletonBackup.instance;
  }
}

const useListService = () => {
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const [customTudus, setCustomTudus] = useRecoilState(tudusState);
  const [archivedLists, setArchivedLists] = useRecoilState(archivedListsState);
  const [archivedTudus, setArchivedTudus] = useRecoilState(archivedTudusState);
  const [unlistedTudus, setUnlistedTudus] = useRecoilState(unlistedTudusState);
  const setRecurrentTuduToRecalculate = useSetRecoilState(recalculateRecurrence);
  
  const getListState = useCallback(
    (stateOrigin: ListOrigin) =>
      stateOrigin === 'default' ? customLists : archivedLists,
    [customLists, archivedLists],
  );

  const getTudusState = useCallback(
    (stateOrigin: ListOrigin) =>
      stateOrigin === 'default'
        ? customTudus
        : stateOrigin === 'unlisted'
        ? new Map([['unlisted', unlistedTudus]])
        : archivedTudus,
    [customTudus, unlistedTudus, archivedTudus],
  );

  const getStateSetter = useCallback(
    (stateOrigin: ListOrigin) =>
      stateOrigin === 'default' ? setCustomLists : setArchivedLists,
    [setCustomLists, setArchivedLists],
  );

  const unlistedTudusStandardSetter: SetterOrUpdater<Map<string, TuduItemMap>> =
    useCallback(
      newData => {
        setUnlistedTudus(previousState => {
          const newMapInstance = new Map(previousState);
          const tuduMap =
            newData instanceof Map
              ? newData.get('unlisted')
              : newData(new Map([['unlisted', newMapInstance]]))?.get(
                  'unlisted',
                );

          return tuduMap ?? previousState;
        });
      },
      [setUnlistedTudus],
    );

  const getTudusStateSetter = useCallback(
    (stateOrigin: ListOrigin) =>
      stateOrigin === 'default'
        ? setCustomTudus
        : stateOrigin === 'unlisted'
        ? unlistedTudusStandardSetter
        : setArchivedTudus,
    [setCustomTudus, unlistedTudusStandardSetter, setArchivedTudus],
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
          const tudusState = getTudusState(origin);
          const tudus = tudusState.get(listId);
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
    [getListState, getTudusState],
  );

  const saveAllLists = useCallback(
    (newLists: ListDataViewModel[], origin: ListOrigin = 'default') => {
      const lists = newLists.map<[string, List]>(x => {
        return [x.id, getListFromViewModel(x)];
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
      if (tudu.listId === UNLISTED_LIST_ID) {
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

      // If the tudu is recurrent, marked as done and is outdated, recalculate the recurrence
      if (tudu.dueDate && tudu.recurrence && tudu.done && isOutdated(tudu.dueDate)) {
        setTimeout(() => setRecurrentTuduToRecalculate(tudu), 1000);
      }
      
    },
    [getTudusStateSetter, saveUnlistedTudus, setRecurrentTuduToRecalculate],
  );

  const saveAllTudus = useCallback(
    (tudus: TuduViewModel[], origin: ListOrigin = 'default') => {
      const unlistedTudusVMs = tudus.filter(x => x.listId === UNLISTED_LIST_ID);

      if (unlistedTudusVMs) {
        saveUnlistedTudus(unlistedTudusVMs);
      }

      const groupedTudus = groupBy(
        tudus.filter(x => x.listId !== UNLISTED_LIST_ID),
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
          return [...tudus].map(
            ([_, tudu]) => new TuduViewModel(tudu, listId, origin, listName),
          );
        }) ?? [];
      const unlisted = [...unlistedTudus].map(
        ([_, tudu]) => new TuduViewModel(tudu, UNLISTED_LIST_ID, 'unlisted'),
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
        .map(([_, tudu]) => new TuduViewModel(tudu, UNLISTED_LIST_ID, 'unlisted'));
      return allTudus.concat(unlisted);
    },
    [getListState, getTudusState, unlistedTudus],
  );

  const getAllStarredTudus = useCallback(
    (origin: ListOrigin = 'default') => {
      const state = getTudusState(origin);
      const listState = getListState(origin);
      const allTudus =
        [...state].flatMap(([listId, tudus]) => {
          const listName = listState.get(listId)?.label;
          return [...tudus]
            .filter(([_, tudu]) => !tudu.done && !!tudu.starred)
            .map(
              ([_, tudu]) => new TuduViewModel(tudu, listId, origin, listName),
            );
        }) ?? [];
      const unlisted = [...unlistedTudus]
        .filter(([_, tudu]) => !tudu.done && !!tudu.starred)
        .map(([_, tudu]) => new TuduViewModel(tudu, UNLISTED_LIST_ID, 'unlisted'));
      return allTudus.concat(unlisted);
    },
    [getListState, getTudusState, unlistedTudus],
  );

  const getAllRecurrentTudusToUpdate = useCallback(
    () => {
      const state = getTudusState('default');
      const listState = getListState('default');
      const allTudus =
        [...state].flatMap(([listId, tudus]) => {
          const listName = listState.get(listId)?.label;
          return [...tudus].map(
            ([_, tudu]) => new TuduViewModel(tudu, listId, 'default', listName),
          );
        }) ?? [];
      const unlisted = [...unlistedTudus].map(
        ([_, tudu]) => new TuduViewModel(tudu, UNLISTED_LIST_ID, 'unlisted'),
      );
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      return allTudus.concat(unlisted).filter(tudu => {
        if (!tudu.recurrence || !tudu.dueDate) return false;

        return isOutdated(tudu.dueDate) && tudu.done;
      });
    },
    [getListState, getTudusState, unlistedTudus],
  );

  const saveList = useCallback(
    (list: ListViewModel) => {
      const listStateSetter = getStateSetter(list.origin);
      
      listStateSetter(previousState => {
        const listExists = previousState.has(list.id);
        if (listExists) {
          const stateClone = new Map(previousState);
          stateClone.set(list.id, list.mapBackList());
          return stateClone;
        }

        var newMap = new Map<string, List>();
        newMap.set(list.id, list.mapBackList());
        newMap = new Map([...newMap, ...previousState]);
        return newMap;
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

  const doStateBackup = useCallback(
    (origin: ListOrigin) => {
      const selectedTudusState = getTudusState(origin);
      const tudusStateClone = new Map(selectedTudusState);

      for (const [listId, tuduMap] of selectedTudusState) {
        tudusStateClone.set(listId, new Map(tuduMap));
      }

      const backup: StateBackup = {
        listBkp:
          origin === 'unlisted' ? undefined : new Map(getListState(origin)),
        tudusBkp: new Map(tudusStateClone),
        origin: origin,
      };
      SingletonBackup.getInstance().backup = backup;
    },
    [getListState, getTudusState],
  );

  const restoreBackup = useCallback(() => {
    const backup = SingletonBackup.getInstance().backup;
    const backupOrigin = backup?.origin;

    if (!backupOrigin) {
      return;
    }

    if (backupOrigin !== 'unlisted' && !!backup.listBkp) {
      const listStateSetter = getStateSetter(backupOrigin);
      listStateSetter(backup.listBkp);
    }

    const tudusStateSetter = getTudusStateSetter(backupOrigin);
    tudusStateSetter(backup.tudusBkp);
  }, [getStateSetter, getTudusStateSetter]);

  const deleteList = useCallback(
    (listData: ListDataViewModel, saveBackup = true) => {
      const listStateSetter = getStateSetter(listData.origin);
      const tudusStateSetter = getTudusStateSetter(listData.origin);

      if (saveBackup) {
        doStateBackup(listData.origin);
      }

      listStateSetter(previousState => {
        const newState = new Map(previousState);
        newState.delete(listData.id);

        return newState;
      });

      tudusStateSetter(previousState => {
        const newState = new Map(previousState);
        newState.delete(listData.id);

        return newState;
      });
    },
    [doStateBackup, getStateSetter, getTudusStateSetter],
  );

  const deleteTudu = useCallback(
    (tuduData: TuduViewModel, saveBackup = true) => {
      const origin = tuduData.origin;
      const tudusStateSetter = getTudusStateSetter(origin);

      if (saveBackup) {
        doStateBackup(origin);
      }

      tudusStateSetter(previousState => {
        const newState = new Map(previousState);
        const tudus = newState.get(tuduData.listId);

        tudus?.delete(tuduData.id);

        return newState;
      });
    },
    [doStateBackup, getTudusStateSetter],
  );

  const deleteTudus = useCallback(
    (tuduList: TuduViewModel[], saveBackup = true) => {
      const origin = tuduList[0].origin;
      const tudusStateSetter = getTudusStateSetter(origin);

      if (saveBackup) {
        doStateBackup(origin);
      }

      tudusStateSetter(previousState => {
        const newState = new Map(previousState);

        tuduList.forEach(tudu => {
          const tudus = newState.get(tudu.listId);
          tudus?.delete(tudu.id);
        });

        return newState;
      });
    },
    [doStateBackup, getTudusStateSetter],
  );

  const undoTudus = useCallback((tuduList: TuduViewModel[]) => {
    const origin = tuduList[0].origin;
    const tudusStateSetter = getTudusStateSetter(origin);

    tudusStateSetter(previousState => {
      const newState = new Map(previousState);

      tuduList.forEach(tudu => {
        const tudus = newState.get(tudu.listId);
        var currentTudu = tudus?.get(tudu.id);
        if (currentTudu) 
          currentTudu.done = false;
      });

      return newState;
    });
  }, []);

  const deleteGroup = useCallback(
    (groupName: string) => {
      doStateBackup('default');

      const allListsFromGroup = [...customLists]
        .filter(([_, list]) => list.groupName === groupName)
        .map(([_, list]) => list);

      allListsFromGroup.forEach(list => {
        deleteList({...list, origin: 'default'} as ListDataViewModel, false);
      });
    },
    [customLists, deleteList, doStateBackup],
  );

  const archiveList = useCallback(
    (listData: ListDataViewModel) => {
      const foundList = customLists.has(listData.id);
      if (!foundList) {
        throw new ItemNotFoundError("The list couldn't be found.", listData);
      }

      const list = getListFromViewModel(listData);
      const tudusToArchive = customTudus.get(list.id);

      setArchivedLists(previousState => {
        const newState = new Map(previousState);
        newState.set(list.id, list);

        return newState;
      });

      setArchivedTudus(previousState => {
        if (!tudusToArchive) {
          return previousState;
        }
        const newState = new Map(previousState);
        newState.set(list.id, tudusToArchive);

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
      customTudus,
      setArchivedLists,
      setArchivedTudus,
      setCustomLists,
      setCustomTudus,
    ],
  );

  const unarchiveList = useCallback(
    (listData: ListDataViewModel) => {
      const foundList = archivedLists.has(listData.id);
      if (!foundList) {
        throw new ItemNotFoundError("The list couldn't be found.", listData);
      }

      const list = getListFromViewModel(listData);
      const tudus = archivedTudus.get(list.id);

      setCustomLists(previousState => {
        const newState = new Map(previousState);
        newState.set(list.id, list);

        return newState;
      });

      setCustomTudus(previousState => {
        const newState = new Map(previousState);
        if (!tudus) {
          return previousState;
        }
        newState.set(list.id, tudus);

        return newState;
      });

      setArchivedLists(previousState => {
        const newState = new Map(previousState);
        newState.delete(list.id);

        return newState;
      });

      setArchivedTudus(previousState => {
        const newState = new Map(previousState);
        newState.delete(listData.id);

        return newState;
      });
    },
    [
      archivedLists,
      archivedTudus,
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
    getAllStarredTudus,
    getAllRecurrentTudusToUpdate,
    getTuduById,
    saveTudu,
    saveAllTudus,
    saveList,
    saveListAndTudus,
    deleteList,
    deleteGroup,
    deleteTudu,
    deleteTudus,
    undoTudus,
    archiveList,
    unarchiveList,
    restoreBackup,
  };
};

export {useListService};
