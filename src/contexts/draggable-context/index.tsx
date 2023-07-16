import React, {memo} from 'react';
import {DraggableContextProviderProps, DraggableContextType} from './types';

const DraggableContext = React.createContext({} as DraggableContextType);

const DraggableContextProvider = memo<DraggableContextProviderProps>(
  ({children, data, onSetData}) => {
    return (
      <DraggableContext.Provider value={{data, setData: onSetData}}>
        {children}
      </DraggableContext.Provider>
    );
  },
);

export {DraggableContext, DraggableContextProvider};
