import {useRecoilState} from 'recoil';
import {
  LinkedListItem,
  LinkedTuduItem,
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
      ([_, value]) => new LinkedListItem(value, origin),
    );

    return linkedLists;
  };

  const saveAllLists = (
    newLists: LinkedListItem[],
    origin: ListOrigin = 'default',
  ) => {
    const lists = newLists.map<[string, List]>(x => [x.data.id, x.data]);
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

    const linkedList = new LinkedListItem(foundList);
    return linkedList;
  };

  const getTuduById = (
    id: string,
    listId: string,
    origin: ListOrigin = 'default',
  ) => {
    const {data: list} = getListById(listId, origin);

    if (!list.tudus.has(id)) {
      throw new ItemNotFoundError("The tudu id couldn't be found.", {
        listId: listId,
        tuduId: id,
        origin,
      });
    }

    const foundTudu = list.tudus.get(id)!;
    const linkedTudu = new LinkedTuduItem(foundTudu, listId, origin);

    return linkedTudu;
  };

  const saveTudu = (tudu: LinkedTuduItem) => {
    // Can only save tudus if the list is not archived
    setCustomLists(previousState => {
      const foundList = previousState.get(tudu.listId);
      if (!foundList) {
        throw new ItemNotFoundError("The list couldn't be found.", tudu);
      }
      const newTuduMap = new Map(foundList.tudus);
      newTuduMap.set(tudu.data.id, tudu.data);
      const newList = {...foundList, tudus: newTuduMap};

      const newState = new Map(previousState);
      newState.set(newList.id, newList);

      return newState;
    });
  };

  const saveList = (list: LinkedListItem) => {
    // Can only edit list if it's not archived
    setCustomLists(previousState => {
      const newState = new Map(previousState);
      newState.set(list.data.id, list.data);

      return newState;
    });
  };

  const archiveList = (list: LinkedListItem) => {
    const foundList = customLists.get(list.data.id);
    if (!foundList) {
      throw new ItemNotFoundError("The list couldn't be found.", list);
    }

    setArchivedLists(previousState => {
      const newState = new Map(previousState);
      newState.set(list.data.id, list.data);

      return newState;
    });

    setCustomLists(previousState => {
      const newState = new Map(previousState);
      newState.delete(list.data.id);

      return newState;
    });
  };

  return {
    getAllLists,
    saveAllLists,
    getListById,
    getTuduById,
    saveTudu,
    saveList,
    archiveList,
  };
};

export {useListService};
