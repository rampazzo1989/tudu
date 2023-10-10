import {useCallback} from 'react';
import {useRecoilState} from 'recoil';
import {
  archivedLists as archivedListsState,
  homeDefaultLists,
  myLists,
} from '../scenes/home/state';
import {BuiltInList, List} from '../scenes/home/types';
import {syncToStorage} from '../utils/state-utils';

const useListStateHelper = () => {
  const [defaultLists, setDefaultLists] = useRecoilState(homeDefaultLists);
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const [archivedLists, setArchivedLists] = useRecoilState(archivedListsState);

  const getListById = useCallback(
    (listId: string): BuiltInList | List | undefined => {
      const selectedListFromDefault = defaultLists.find(
        x => x.label === listId,
      );

      if (selectedListFromDefault) {
        return selectedListFromDefault;
      }

      const customList = customLists.find(x => x.label === listId);

      if (customList) {
        return customList;
      }

      return archivedLists.find(x => x.label === listId);
    },
    [archivedLists, customLists, defaultLists],
  );

  const updateList = useCallback(
    (list: BuiltInList | List) => {
      console.log({list: list.tudus});
      const isDefaultList = defaultLists.some(x => x.id === list.id);
      const isCustomList = customLists.some(x => x.id === list.id);
      const isArchivedList = archivedLists.find(x => x.id === list.id);

      if (isDefaultList) {
        return syncToStorage(setDefaultLists);
      }
      if (isCustomList) {
        return syncToStorage(setCustomLists);
      }
      if (isArchivedList) {
        return syncToStorage(setArchivedLists);
      }
    },
    [
      archivedLists,
      customLists,
      defaultLists,
      setArchivedLists,
      setCustomLists,
      setDefaultLists,
    ],
  );

  return {getListById, updateList};
};

export {useListStateHelper};
