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
      const isDefaultList = defaultLists.findIndex(x => x.id === list.id);
      const isCustomList = customLists.findIndex(x => x.id === list.id);
      const isArchivedList = archivedLists.findIndex(x => x.id === list.id);

      if (isDefaultList >= 0) {
        // return syncToStorage(setDefaultLists);
        setDefaultLists(x => {
          const newList = x.slice();
          newList.splice(isDefaultList, 1, list as BuiltInList);
          return newList;
        });
      }
      if (isCustomList >= 0) {
        // return syncToStorage(setCustomLists);
        setCustomLists(x => {
          const newList = x.slice();
          newList.splice(isCustomList, 1, list);
          return newList;
        });
      }
      if (isArchivedList >= 0) {
        // return syncToStorage(setArchivedLists);
        setArchivedLists(x => {
          const newList = x.slice();
          newList.splice(isArchivedList, 1, list);
          return newList;
        });
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
