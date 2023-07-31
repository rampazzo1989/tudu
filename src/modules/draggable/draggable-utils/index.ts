import {DraggableItem} from '../draggable-context/types';

const compareBy =
  <T>(property: keyof T) =>
  (a: T, b: T) => {
    if (a[property] < b[property]) {
      return -1;
    }
    if (a[property] > b[property]) {
      return 1;
    }
    return 0;
  };

export const mapListToDraggableItems = <T>(
  list: T[],
  groupProperty: keyof T,
  orderByProperty?: keyof T,
) => {
  const draggableList: DraggableItem<T>[] = [];

  for (const item of list) {
    const groupId =
      item[groupProperty] === undefined
        ? undefined
        : String(item[groupProperty]);
    if (groupId) {
      const alreadyAdded = draggableList.find(x => x.groupId === groupId);
      if (alreadyAdded) {
        alreadyAdded.data = [...alreadyAdded.data, item];
        if (orderByProperty) {
          alreadyAdded.data.sort(compareBy(orderByProperty));
        }
      } else {
        draggableList.push(new DraggableItem<T>([item], groupId));
      }
    } else {
      draggableList.push(new DraggableItem<T>([item]));
    }
  }

  return draggableList;
};

export const mapDraggableItemsToList = <T extends object>(
  newOrderList: DraggableItem<T>[],
  groupIdProperty: keyof T,
) => {
  for (let itemIndex in newOrderList) {
    const item = newOrderList[itemIndex];
    if (item.groupId) {
      for (let subItemIndex in item.data) {
        const subItem = item.data[subItemIndex];
        const cloneItem = {...subItem};
        cloneItem[groupIdProperty] = item.groupId as T[keyof T];
        item.data[subItemIndex] = cloneItem;
      }
    } else {
      item.groupId = undefined;
      item.data[0][groupIdProperty] = undefined as T[keyof T];
    }
  }

  return newOrderList.flatMap(item => item.data);
};

export const removeSubItem = <T>(list: DraggableItem<T>[], item: T) => {
  const group = list.filter(x => !!x.groupId).find(g => g.data.includes(item));

  if (group) {
    const itemIndex = group.data.indexOf(item);
    if (itemIndex >= 0) {
      group.data.splice(itemIndex, 1);
    }
  }
};
