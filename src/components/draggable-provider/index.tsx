import React, {memo} from 'react';
import {DraggableProviderProps} from './types';

const DraggableProvider = memo<DraggableProviderProps>(({children, data}) => {
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {data}) ?? <></>;
    }
    return child ?? <></>;
  });
});

export {DraggableProvider};
