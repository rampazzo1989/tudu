import React, {memo} from 'react';
import {DraxView} from 'react-native-drax';
import Animated, {Layout} from 'react-native-reanimated';
import {DraggableItem} from '../draggable-item';
import {styles} from './styles';
import {DraggableViewProps} from './types';
import {useDraggableViewHooks} from './useDraggableViewHooks';

const DraggableView = memo(
  <T,>({
    payload,
    enteringAnimation,
    children,
    draggableViewKey,
    isReceiver = false,
    draggableEnabled = true,
  }: DraggableViewProps<T>) => {
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
        layout={Layout.duration(200)}
        // entering={enteringAnimation}
        style={animatedStyle}
        onLayout={handleWrapperViewLayout}>
        <DraxView
          isParent
          onReceiveDragDrop={handleContainerReceiveDragDrop}
          onReceiveDragOver={handleContainerReceiveDragOver}
          onReceiveDragEnter={handleContainerReceiveDragEnter}
          onReceiveDragExit={handleContainerReceiveDragExit}
          key={draggableViewKey}
          style={styles.container}>
          <DraggableItem
            isParent={isReceiver}
            payload={payload}
            draggable={draggableEnabled}>
            {children}
          </DraggableItem>
        </DraxView>
      </Animated.View>
    );
  },
);

export {DraggableView};
