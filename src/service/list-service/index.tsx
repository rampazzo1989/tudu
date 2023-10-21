import {useRecoilState} from 'recoil';
import {List, TuduItem} from '../../scenes/home/types';
import {ListOrigin} from './types';
import {
  myLists,
  archivedLists as archivedListsState,
} from '../../scenes/home/state';

const useListService = () => {
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const [archivedLists, setArchivedLists] = useRecoilState(archivedListsState);

  const getListById = (id: string, origin: ListOrigin = 'default') => {
    const listState = origin === 'default' ? customLists : archivedLists;

    if (!listState.has(id)) {
      throw new Error(`The list Id couldn't be found in ${origin} origin.`, {
        id,
      });
    }
    const foundList = listState.get(id);
    return {};
  };

  const getTuduById = (
    id: string,
    listId: string,
    origin: ListOrigin = 'default',
  ) => {
    return {};
  };

  const saveTudu = (tudu: TuduItem, listId: string) => {};

  const saveList = (list: List) => {};

  const archiveList = (list: List) => {
    archiveSetter(x => [...x, list]);

    customListsSetter(x => {
      return removeFromList(x, [list]);
    });
  };

  return {getListById, getTuduById, saveTudu, saveList};
};

export {useListService};
