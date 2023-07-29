export type DraggableContextType<T> = {
  data: DraggableItem<T>[];
  setData: (newData: DraggableItem<T>[]) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export type DraggableContextProviderProps<T> = {
  children: React.ReactNode;
  data: DraggableItem<T>[];
  onSetData: (newData: DraggableItem<T>[]) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export class DraggableItem<T> {
  groupId?: string;
  data: T[];

  constructor(data: T[] = [], groupId?: string) {
    this.data = data;
    this.groupId = groupId;
  }
}
