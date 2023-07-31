import React, {memo} from 'react';
import {DraxView} from 'react-native-drax';
import Animated, {Layout} from 'react-native-reanimated';
import {DraggableItem} from '../draggable-item';
import {styles} from './styles';
import {DraggableViewProps} from './types';
import {useDraggableViewHooks} from './useDraggableViewHooks';

const DraggableView = memo(
  <T,>({payload, isReceiver = false, children}: DraggableViewProps<T>) => {
    const {
      handleWrapperViewLayout,
      animatedStyle,
      handleContainerReceiveDragDrop,
      handleContainerReceiveDragOver,
      handleContainerReceiveDragEnter,
      handleContainerReceiveDragExit,
    } = useDraggableViewHooks({payload, isReceiver});

    return (
      <Animated.View
        layout={Layout.springify()}
        style={animatedStyle}
        onLayout={handleWrapperViewLayout}>
        <DraxView
          isParent
          onReceiveDragDrop={handleContainerReceiveDragDrop}
          onReceiveDragOver={handleContainerReceiveDragOver}
          onReceiveDragEnter={handleContainerReceiveDragEnter}
          onReceiveDragExit={handleContainerReceiveDragExit}
          style={styles.container}>
          <DraggableItem isParent={isReceiver} payload={payload}>
            {children}
          </DraggableItem>
        </DraxView>
      </Animated.View>
    );
  },
);

export {DraggableView};
