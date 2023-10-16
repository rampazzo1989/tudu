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
      const onlyItem = {...item.data[0]};
      onlyItem[groupIdProperty] = undefined as T[keyof T];

      item.data = [onlyItem];
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

export const isNestedItem = <T>(item: DraggableItem<T> | T): item is T => {
  return !(item instanceof DraggableItem);
};

export const deleteItem = <T>(
  list: DraggableItem<T>[],
  listSetter: (newData: DraggableItem<T>[]) => void,
  deletingItem?: DraggableItem<T> | T,
) => {
  if (!deletingItem) {
    return;
  }
  const cloneList = list?.slice();

  if (isNestedItem(deletingItem)) {
    removeSubItem(cloneList, deletingItem);
  } else {
    const index = cloneList?.indexOf(deletingItem);
    cloneList?.splice(index, 1);
  }

  listSetter(cloneList);
};

export const castItem = <T>(item: any) => {
  return item instanceof DraggableItem
    ? (item as DraggableItem<T>)
    : new DraggableItem([item as T]);
};

export const ungroupAllItems = <T>(
  list: DraggableItem<T>[],
  listSetter: (newData: DraggableItem<T>[]) => void,
  group: DraggableItem<T>,
) => {
  const cloneList = list?.slice();
  const groupIndex = cloneList.indexOf(group);

  if (groupIndex >= 0) {
    const castedGroupItems = group.data.map(item => castItem<T>(item));
    cloneList.splice(groupIndex, 1, ...castedGroupItems);
  }

  listSetter(cloneList);
};

export const renameGroup = <T>(
  list: DraggableItem<T>[],
  listSetter: (newData: DraggableItem<T>[]) => void,
  group: DraggableItem<T>,
  newName: string,
) => {
  const itemIndex = list.indexOf(group);
  const newGroup = new DraggableItem<T>(group.data, newName);
  const newList = list.slice();
  newList.splice(itemIndex, 1, newGroup);
  listSetter(newList);
};

export const insertNewItem = <T>(
  list: DraggableItem<T>[],
  listSetter: (newData: DraggableItem<T>[]) => void,
  newItem: T,
) => {
  const newDraggableItem = new DraggableItem([newItem]);
  listSetter([newDraggableItem, ...list]);
};

export const refreshListState = <T>(
  list: DraggableItem<T>[],
  listSetter: (newData: DraggableItem<T>[]) => void,
) => {
  listSetter([...list]);
};

export const getUngroupedItems = <T>(list: DraggableItem<T>[]) => {
  const ungrouped = list.filter(x => !x.groupId);
  return ungrouped;
};
