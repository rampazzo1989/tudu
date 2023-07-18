import {DraggableItem} from '../../contexts/draggable-context/types';

export type DraggableViewProps<TItem> = {
  payload: DraggableItem<TItem>;
  children: React.ReactNode;
  isReceiver?: boolean;
};
