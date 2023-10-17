import {t} from 'i18next';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {isNestedItem} from '../../modules/draggable/draggable-utils';
import {List} from '../../scenes/home/types';
import {SetterOrUpdater} from 'recoil';
import {removeFromList} from '../array-utils';

export const getTypeItemOrGroup = (item: DraggableItem<List> | List) => {
  let itemType: string = t('messages.confirmListDeleteItemType.list');

  if (!isNestedItem(item)) {
    const draggableItem = item as DraggableItem<List>;
    itemType = draggableItem.groupId
      ? t('messages.confirmListDeleteItemType.group')
      : itemType;
  }

  return itemType;
};

export const generateListAndGroupDeleteTitle = (
  item?: DraggableItem<List> | List,
) => {
  if (!item) {
    return '';
  }
  let listName: string;
  const itemType = getTypeItemOrGroup(item);
  if (isNestedItem(item)) {
    listName = (item as List).label;
  } else {
    const draggableItem = item as DraggableItem<List>;
    listName = draggableItem.groupId ?? draggableItem.data[0].label;
  }
  return t('messages.confirmListDelete', {itemType, listName});
};

export const generateListAndGroupArchiveTitle = (
  item?: DraggableItem<List> | List,
) => {
  if (!item) {
    return '';
  }
  let listName: string;
  let itemType: string = t('messages.confirmListDeleteItemType.list');
  if (isNestedItem(item)) {
    listName = (item as List).label;
  } else {
    const draggableItem = item as DraggableItem<List>;
    listName = draggableItem.groupId ?? draggableItem.data[0].label;
    itemType = draggableItem.groupId
      ? t('messages.confirmListDeleteItemType.group')
      : itemType;
  }
  return t('messages.confirmListArchive', {itemType, listName});
};

const getNewNameWithCopyNumber = (name: string) => {
  const hasCopyNumber = name.match(/^([A-Za-z\s]+) \((\d+)\)/);

  const textPart = hasCopyNumber?.[1] ?? name;
  const copyNumber = hasCopyNumber ? parseInt(hasCopyNumber[2], 10) + 1 : 1;

  return `${textPart} (${copyNumber})`;
};

export const getDuplicateProofListTitle = (
  list: List[],
  newLabel: string,
): string => {
  let alreadyExists = list.some(x => x.label === newLabel);

  if (alreadyExists) {
    const newNameWithCopyNumber = getNewNameWithCopyNumber(newLabel);

    return getDuplicateProofListTitle(list, newNameWithCopyNumber);
  } else {
    return newLabel;
  }
};

export const getDuplicateProofGroupTitle = (
  list: DraggableItem<List>[],
  newName: string,
): string => {
  const alreadyExists = list.some(draggable => draggable.groupId === newName);
  if (alreadyExists) {
    const newNameWithCopyNumber = getNewNameWithCopyNumber(newName);

    return getDuplicateProofGroupTitle(list, newNameWithCopyNumber);
  } else {
    return newName;
  }
};

export const archiveList = (
  archiveSetter: SetterOrUpdater<List[]>,
  customListsSetter: SetterOrUpdater<List[]>,
  list: List,
) => {
  archiveSetter(x => [...x, list]);

  customListsSetter(x => {
    return removeFromList(x, [list]);
  });
};

export const unarchiveList = (
  archiveSetter: SetterOrUpdater<List[]>,
  customListsSetter: SetterOrUpdater<List[]>,
  list: List,
) => {
  customListsSetter(x => [...x, list]);

  archiveSetter(x => {
    return removeFromList(x, [list]);
  });
};

export const insertList = (
  customListsSetter: SetterOrUpdater<List[]>,
  list: List,
) => {
  customListsSetter(x => [list, ...x]);
};

export const updateList = (
  customListsSetter: SetterOrUpdater<List[]>,
  list: List,
) => {
  customListsSetter(x => {
    const cloneList = x.slice();
    const itemIndex = cloneList.findIndex(item => item.id === list.id);

    if (itemIndex < 0) {
      return x;
    }

    cloneList.splice(itemIndex, 1, list);

    return cloneList;
  });
};

export const deleteList = (
  customListsSetter: SetterOrUpdater<List[]>,
  list: List,
) => {
  customListsSetter(x => {
    const cloneList = x.slice();
    const itemIndex = cloneList.findIndex(item => item.id === list.id);

    if (itemIndex < 0) {
      return x;
    }

    cloneList.splice(itemIndex, 1);

    return cloneList;
  });
};
