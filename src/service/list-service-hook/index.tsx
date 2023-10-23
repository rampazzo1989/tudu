import {useRecoilState} from 'recoil';
import {
  LinkedListItem,
  LinkedTuduItem,
  List,
  ListOrigin,
  TuduItem,
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
      throw new ItemNotFoundError("The list id couldn't be found.", {
        listId: id,
        origin,
      });
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
        listId: id,
        tuduId: id,
        origin,
      });
    }

    const foundTudu = list.tudus.get(id)!;
    const linkedTudu = new LinkedTuduItem(foundTudu, listId, origin);

    return linkedTudu;
  };

  const saveTudu = (tudu: TuduItem, listId: string) => {};

  const saveList = (list: List) => {};

  const archiveList = (list: List) => {
    archiveSetter(x => [...x, list]);

    customListsSetter(x => {
      return removeFromList(x, [list]);
    });
  };

  return {
    getAllLists,
    saveAllLists,
    getListById,
    getTuduById,
    saveTudu,
    saveList,
  };
};

export {useListService};
