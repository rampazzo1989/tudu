import {t} from 'i18next';
import {DraggableItem} from '../../modules/draggable/draggable-context/types';
import {isNestedItem} from '../../modules/draggable/draggable-utils';
import {List} from '../../scenes/home/types';

export const generateListAndGroupDeleteTitle = (
  item?: DraggableItem<List> | List,
) => {
  if (!item) {
    return '';
  }
  let listName: string;
  let itemType: string = t('messages.confirmDeleteItemType.list');
  if (isNestedItem(item)) {
    listName = (item as List).label;
  } else {
    const draggableItem = item as DraggableItem<List>;
    listName = draggableItem.groupId ?? draggableItem.data[0].label;
    itemType = draggableItem.groupId
      ? t('messages.confirmDeleteItemType.group')
      : itemType;
  }
  return t('messages.confirmDelete', {itemType, listName});
};
