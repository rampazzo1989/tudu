export type DraggableContextType = {
  data: any[];
  setData: (newData: any[]) => void;
};

export type DraggableContextProviderProps = {
  children: React.ReactNode;
  data: any[];
  onSetData: (newData: any[]) => void;
};
