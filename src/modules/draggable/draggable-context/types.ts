export type DraggableContextType<T> = {
  data: DraggableItem<T>[];
  setData: (newData: DraggableItem<T>[], allowUndoThisSave?: boolean) => void;
  showConfirmationModal: (
    itemToDealWith: DraggableItem<T> | T,
    titleBuilderFn: (item?: DraggableItem<T> | T) => string,
    action: 'delete' | 'archive',
    onCancel?: () => void,
    onAction?: () => void,
  ) => void;
  undoLastDeletion: () => void;
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
  orderIndex?: number;
  data: T[];

  constructor(data: T[] = [], groupId?: string, orderIndex?: number) {
    this.data = data;
    this.groupId = groupId;
    this.orderIndex = orderIndex;
  }
}

export const SPECIAL_DRAGGABLE_PAYLOAD_TYPES = ['delete', 'move'] as const;

export type SpecialDraggablePayload = {
  id: (typeof SPECIAL_DRAGGABLE_PAYLOAD_TYPES)[number];
};
