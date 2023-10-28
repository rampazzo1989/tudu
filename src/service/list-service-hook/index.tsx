import {useRecoilState} from 'recoil';
import {
  LinkedListViewModel,
  LinkedTuduViewModel,
  List,
  ListOrigin,
} from '../../scenes/home/types';
import {
  myLists,
  archivedLists as archivedListsState,
} from '../../scenes/home/state';
import {ItemNotFoundError} from './errors/item-not-found-error';

const useListService = () => {
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const [archivedLists, setArchivedLists] = useRecoilState(archivedListsState);

  const getState = (stateOrigin: ListOrigin) =>
    stateOrigin === 'default' ? customLists : archivedLists;

  const getStateSetter = (stateOrigin: ListOrigin) =>
    stateOrigin === 'default' ? setCustomLists : setArchivedLists;

  const getAllLists = (origin: ListOrigin = 'default') => {
    const listState = getState(origin);
    const linkedLists = [...listState].map(
      ([_, value]) => new LinkedListViewModel(value, origin),
    );

    return linkedLists;
  };

  const saveAllLists = (
    newLists: LinkedListViewModel[],
    origin: ListOrigin = 'default',
  ) => {
    const lists = newLists.map<[string, List]>(x => [x.id, x.mapBack()]);
    const newMap = new Map<string, List>(lists);

    const stateSetter = getStateSetter(origin);

    stateSetter(newMap);
  };

  const getListById = (id: string, origin: ListOrigin = 'default') => {
    const listState = getState(origin);

    if (!listState.has(id)) {
      return;
    }
    const foundList = listState.get(id)!;

    const linkedList = new LinkedListViewModel(foundList);
    return linkedList;
  };

  const getTuduById = (
    id: string,
    listId: string,
    origin: ListOrigin = 'default',
  ) => {
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
    const linkedTudu = new LinkedTuduViewModel(foundTudu, listId, origin);

    return linkedTudu;
  };

  const saveTudu = (tudu: LinkedTuduViewModel) => {
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
  };

  const saveAllTudus = (tudus: LinkedTuduViewModel[]) => {
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
  };

  const saveList = (list: LinkedListViewModel) => {
    // Can only edit list if it's not archived
    setCustomLists(previousState => {
      const newState = new Map(previousState);
      newState.set(list.id, list.mapBack());

      return newState;
    });
  };

  const archiveList = (list: LinkedListViewModel) => {
    const foundList = customLists.get(list.id);
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
  };

  return {
    getAllLists,
    saveAllLists,
    getListById,
    getTuduById,
    saveTudu,
    saveAllTudus,
    saveList,
    archiveList,
  };
};

export {useListService};
