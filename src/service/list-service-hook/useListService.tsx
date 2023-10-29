import {useRecoilState} from 'recoil';
import {
  ListViewModel,
  TuduViewModel,
  List,
  ListOrigin,
} from '../../scenes/home/types';
import {
  myLists,
  archivedLists as archivedListsState,
} from '../../scenes/home/state';
import {ItemNotFoundError} from './errors/item-not-found-error';
import {useCallback} from 'react';

const useListService = () => {
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const [archivedLists, setArchivedLists] = useRecoilState(archivedListsState);

  const getState = useCallback(
    (stateOrigin: ListOrigin) =>
      stateOrigin === 'default' ? customLists : archivedLists,
    [customLists, archivedLists],
  );

  const getStateSetter = useCallback(
    (stateOrigin: ListOrigin) =>
      stateOrigin === 'default' ? setCustomLists : setArchivedLists,
    [setCustomLists, setArchivedLists],
  );

  const getAllLists = useCallback(
    (origin: ListOrigin = 'default') => {
      const listState = getState(origin);
      const linkedLists = [...listState].map(
        ([_, value]) => new ListViewModel(value, origin),
      );

      return linkedLists;
    },
    [getState],
  );

  const saveAllLists = useCallback(
    (newLists: ListViewModel[], origin: ListOrigin = 'default') => {
      const lists = newLists.map<[string, List]>(x => [x.id, x.mapBack()]);
      const newMap = new Map<string, List>(lists);

      const stateSetter = getStateSetter(origin);

      stateSetter(newMap);
    },
    [getStateSetter],
  );

  const getListById = useCallback(
    (id: string, origin: ListOrigin = 'default') => {
      const listState = getState(origin);

      if (!listState.has(id)) {
        return;
      }
      const foundList = listState.get(id)!;

      const linkedList = new ListViewModel(foundList);
      return linkedList;
    },
    [getState],
  );

  const getTuduById = useCallback(
    (id: string, listId: string, origin: ListOrigin = 'default') => {
      const linkedList = getListById(listId, origin);
      const list = linkedList?.mapBack();

      if (!list?.tudus.has(id)) {
        throw new ItemNotFoundError("The tudu id couldn't be found.", {
          listId: listId,
          tuduId: id,
          origin,
        });
      }

      const foundTudu = list.tudus.get(id)!;
      const linkedTudu = new TuduViewModel(foundTudu, listId, origin);

      return linkedTudu;
    },
    [getListById],
  );

  const saveTudu = useCallback(
    (tudu: TuduViewModel) => {
      // Can only save tudus if the list is not archived
      setCustomLists(previousState => {
        const foundList = previousState.get(tudu.listId);
        if (!foundList) {
          throw new ItemNotFoundError("The list couldn't be found.", tudu);
        }
        const newTuduMap = new Map(foundList.tudus);
        newTuduMap.set(tudu.id, tudu.mapBack());
        const newList = {...foundList, tudus: newTuduMap};

        const newState = new Map(previousState);
        newState.set(newList.id, newList);

        return newState;
      });
    },
    [setCustomLists],
  );

  const saveAllTudus = useCallback(
    (tudus: TuduViewModel[]) => {
      const listIds = tudus.map(x => x.listId);
      const uniqueListIds = new Set(listIds);
      if (uniqueListIds.size > 1) {
        throw new Error(
          'Saving multiple tudus to multiple lists are not supported yet',
        );
      }
      const listId = [...uniqueListIds][0];
      // Can only save tudus if the list is not archived
      setCustomLists(previousState => {
        const foundList = previousState.get(listId);
        if (!foundList) {
          throw new ItemNotFoundError("The list couldn't be found.", listId);
        }
        const newTuduMap = new Map(foundList.tudus);

        tudus.forEach(tudu => {
          newTuduMap.set(tudu.id, tudu.mapBack());
        });

        const newList = {...foundList, tudus: newTuduMap};

        const newState = new Map(previousState);
        newState.set(newList.id, newList);

        return newState;
      });
    },
    [setCustomLists],
  );

  const saveList = useCallback(
    (list: ListViewModel) => {
      // Can only edit list if it's not archived
      setCustomLists(previousState => {
        const newState = new Map(previousState);
        newState.set(list.id, list.mapBack());

        return newState;
      });
    },
    [setCustomLists],
  );

  const deleteList = useCallback(
    (list: ListViewModel) => {
      const listStateSetter =
        list.origin === 'default' ? setCustomLists : setArchivedLists;

      listStateSetter(previousState => {
        const newState = new Map(previousState);
        newState.delete(list.id);

        return newState;
      });
    },
    [setArchivedLists, setCustomLists],
  );

  const archiveList = useCallback(
    (list: ListViewModel) => {
      const foundList = customLists.has(list.id);
      if (!foundList) {
        throw new ItemNotFoundError("The list couldn't be found.", list);
      }

      setArchivedLists(previousState => {
        const newState = new Map(previousState);
        newState.set(list.id, list.mapBack());

        return newState;
      });

      setCustomLists(previousState => {
        const newState = new Map(previousState);
        newState.delete(list.id);

        return newState;
      });
    },
    [customLists, setArchivedLists, setCustomLists],
  );

  const unarchiveList = useCallback(
    (list: ListViewModel) => {
      const foundList = archivedLists.has(list.id);
      if (!foundList) {
        throw new ItemNotFoundError("The list couldn't be found.", list);
      }

      setCustomLists(previousState => {
        const newState = new Map(previousState);
        newState.set(list.id, list.mapBack());

        return newState;
      });

      setArchivedLists(previousState => {
        const newState = new Map(previousState);
        newState.delete(list.id);

        return newState;
      });
    },
    [archivedLists, setCustomLists, setArchivedLists],
  );

  return {
    getAllLists,
    saveAllLists,
    getListById,
    getTuduById,
    saveTudu,
    saveAllTudus,
    saveList,
    deleteList,
    archiveList,
    unarchiveList,
  };
};

export {useListService};
