import React, {memo} from 'react';
import {DraxView} from 'react-native-drax';
import Animated, {Layout} from 'react-native-reanimated';
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
      draggedViewSnapBackAnimationOn,
      handleItemDragEnter,
      handleItemDragExit,
      draggableContext,
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
          <DraxView
            isParent={isReceiver}
            animateSnapback={draggedViewSnapBackAnimationOn}
            draggable
            longPressDelay={300}
            draggingStyle={styles.itemDragging}
            hoverStyle={styles.itemHover}
            receivingStyle={styles.itemReceiving}
            payload={payload}
            onDragEnter={handleItemDragEnter}
            onDragExit={handleItemDragExit}
            onDragStart={draggableContext.onDragStart}
            onDragEnd={draggableContext.onDragEnd}
            onDragDrop={draggableContext.onDragEnd}
            style={styles.item}>
            {children}
          </DraxView>
        </DraxView>
      </Animated.View>
    );
  },
);

export {DraggableView};
