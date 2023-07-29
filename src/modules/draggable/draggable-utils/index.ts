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
