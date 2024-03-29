import {t} from 'i18next';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {isNestedItem} from '../../modules/draggable/draggable-utils';
import {List, ListDataViewModel} from '../../scenes/home/types';

export const getTypeItemOrGroup = (
  item: DraggableItem<ListDataViewModel> | ListDataViewModel,
) => {
  let itemType: string = t('messages.confirmListDeleteItemType.list');

  if (!isNestedItem(item)) {
    const draggableItem = item as DraggableItem<ListDataViewModel>;
    itemType = draggableItem.groupId
      ? t('messages.confirmListDeleteItemType.group')
      : itemType;
  }

  return itemType;
};

export const generateListAndGroupDeleteTitle = (
  item?: DraggableItem<ListDataViewModel> | ListDataViewModel,
) => {
  if (!item) {
    return '';
  }
  let listName: string;
  const itemType = getTypeItemOrGroup(item);
  if (isNestedItem(item)) {
    listName = (item as ListDataViewModel).label;
  } else {
    const draggableItem = item as DraggableItem<ListDataViewModel>;
    listName = draggableItem.groupId ?? draggableItem.data[0].label;
  }
  return t('messages.confirmListDelete', {itemType, listName});
};

export const generateListAndGroupArchiveTitle = (
  item?: DraggableItem<ListDataViewModel> | ListDataViewModel,
) => {
  if (!item) {
    return '';
  }
  let listName: string;
  let itemType: string = t('messages.confirmListDeleteItemType.list');
  if (isNestedItem(item)) {
    listName = (item as ListDataViewModel).label;
  } else {
    const draggableItem = item as DraggableItem<ListDataViewModel>;
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
  lists: ListDataViewModel[],
  newLabel: string,
): string => {
  let alreadyExists = lists.some(x => x.label === newLabel);

  if (alreadyExists) {
    const newNameWithCopyNumber = getNewNameWithCopyNumber(newLabel);

    return getDuplicateProofListTitle(lists, newNameWithCopyNumber);
  } else {
    return newLabel;
  }
};

export const getDuplicateProofGroupTitle = (
  list: DraggableItem<ListDataViewModel>[],
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

export const getListFromViewModel = (viewModel: ListDataViewModel): List => {
  const {id, label, color, groupName} = viewModel;
  return {
    id,
    label,
    color,
    groupName,
  };
};
