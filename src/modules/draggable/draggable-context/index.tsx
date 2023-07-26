import React from 'react';
import {DraggableContextProviderProps, DraggableContextType} from './types';

const DraggableContext = React.createContext({} as DraggableContextType<T>);

const DraggableContextProvider = <T,>({
  children,
  data,
  onSetData,
  onDragStart,
  onDragEnd,
}: DraggableContextProviderProps<T>) => {
  return (
    <DraggableContext.Provider
      value={{data, setData: onSetData, onDragStart, onDragEnd}}>
      {children}
    </DraggableContext.Provider>
  );
};

export {DraggableContext, DraggableContextProvider};
