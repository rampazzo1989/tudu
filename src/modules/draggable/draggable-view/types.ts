import {DraggableItem} from '../draggable-context/types';

export type DraggableViewProps<TItem> = {
  payload: DraggableItem<TItem>;
  children: React.ReactNode;
  isReceiver?: boolean;
};

export type UseDraggableViewHooksProps<T> = {
  payload: DraggableItem<T>;
  isReceiver?: boolean;
};
