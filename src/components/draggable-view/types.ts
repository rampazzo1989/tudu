export type DraggableViewProps<TItem> = {
  payload: TItem;
  children: React.ReactNode;
  isReceiver?: boolean;
};
