import {useCallback, useContext, useEffect, useState} from 'react';
import {LayoutChangeEvent} from 'react-native';
import {DraxDragWithReceiverEventData} from 'react-native-drax';
import {runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {useRecoilValue} from 'recoil';
import {isEmpty} from '../../../utils/general-utils';
import {DraggableContext} from '../draggable-context';
import {DraggableItem} from '../draggable-context/types';
import {castItem, removeSubItem} from '../draggable-utils';
import {draggedItemHeight} from '../state';
import {UseDraggableViewHooksProps} from './types';

const useDraggableViewHooks = <T>({
  payload,
  isReceiver,
}: UseDraggableViewHooksProps<T>) => {
  const draggableContext = useContext(DraggableContext);

  const placeholderHeight = useRecoilValue(draggedItemHeight);

  const sortReceiverHeight = useSharedValue<number | undefined>(undefined);
  const isReceivingNestedItem = useSharedValue(false);
  const itemHeight = useSharedValue<number | undefined>(undefined);

  const showPlaceholder = useCallback(() => {
    sortReceiverHeight.value = (itemHeight.value ?? 0) + placeholderHeight;
  }, [itemHeight.value, placeholderHeight, sortReceiverHeight]);

  const hidePlaceholder = useCallback(() => {
    sortReceiverHeight.value = itemHeight.value;
  }, [itemHeight.value, sortReceiverHeight]);

  const isNestedItem = useCallback((item: any) => {
    return !(item instanceof DraggableItem<T>);
  }, []);

  useEffect(() => {
    if (isEmpty(draggableContext)) {
      throw new Error(
        'There must be a DraggableContextProvider above a DraggableView.',
      );
    }
  }, [draggableContext]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: sortReceiverHeight.value,
      marginTop: 8,
      opacity: isReceivingNestedItem.value ? 0.5 : 1,
    };
  }, []);

  const cancelDropping = useCallback(() => {
    isReceivingNestedItem.value = false;
  }, [isReceivingNestedItem]);

  const handleWrapperViewLayout = useCallback(
    (event: LayoutChangeEvent) => {
      itemHeight.value = itemHeight.value ?? event.nativeEvent.layout.height;
    },
    [itemHeight],
  );

  const removeFromOriginalGroup = useCallback(
    (uncastedDraggedItem: any) => {
      const cloneList = draggableContext.data.slice();
      removeSubItem(cloneList, uncastedDraggedItem);
      draggableContext.setData(cloneList);
    },
    [draggableContext],
  );

  const handleContainerReceiveDragDrop = useCallback(
    (data: DraxDragWithReceiverEventData) => {
      hidePlaceholder();
      const draggedItem = castItem(data.dragged.payload);
      const uncastedDraggedItem = data.dragged.payload;

      if (draggedItem === payload) {
        return cancelDropping();
      }

      // If the dragged item is a group item, check if it's from the current group before adding
      if (isReceivingNestedItem.value) {
        const itsFromThisGroup =
          isNestedItem(uncastedDraggedItem) &&
          payload.data.indexOf(uncastedDraggedItem) >= 0;

        if (itsFromThisGroup) {
          return cancelDropping();
        }
      }

      if (
        draggedItem.orderIndex !== undefined &&
        payload.orderIndex !== undefined
      ) {
        const newList = draggableContext.data.slice();

        // Removes the dragged item from the list
        const [removedItem] = newList.splice(draggedItem.orderIndex, 1);

        const receivingItemIndex = newList.indexOf(payload);
        console.log('holla', draggedItem.orderIndex, payload.orderIndex, receivingItemIndex);

        // Inserts the dragged item in the new position
        newList.splice(receivingItemIndex, 0, removedItem);

        isReceivingNestedItem.value = false;

        draggableContext.setData(newList);

        return;
      }

      const newList = draggableContext.data.slice();
      const draggedItemIndex = draggableContext.data.indexOf(draggedItem);

      // Remove from the list if found
      if (draggedItemIndex >= 0) {
        newList.splice(draggedItemIndex, 1);
      }

      // If it's an item from a group
      if (isNestedItem(uncastedDraggedItem)) {
        removeFromOriginalGroup(uncastedDraggedItem);
      }

      if (isReceivingNestedItem.value && payload.groupId) {
        payload.data = payload.data.concat(draggedItem.data);
      } else {
        const currentItemIndex = newList.indexOf(payload);
        newList.splice(currentItemIndex, 0, draggedItem);
      }

      draggableContext.setData(newList);

      isReceivingNestedItem.value = false;
    },
    [
      cancelDropping,
      draggableContext,
      hidePlaceholder,
      isNestedItem,
      isReceivingNestedItem,
      payload,
      removeFromOriginalGroup,
    ],
  );

  const handleContainerReceiveDragOver = useCallback(
    (data: DraxDragWithReceiverEventData) => {
      if (isReceiver) {
        if (data.receiver.receiveOffset.y > placeholderHeight) {
          isReceivingNestedItem.value = true;
          hidePlaceholder();
        } else {
          isReceivingNestedItem.value = false;
          if (data.dragged.payload !== payload) {
            showPlaceholder();
          }
        }
      } else {
        isReceivingNestedItem.value = false;
      }
    },
    [
      hidePlaceholder,
      isReceiver,
      isReceivingNestedItem,
      payload,
      placeholderHeight,
      showPlaceholder,
    ],
  );

  const handleContainerReceiveDragEnter = useCallback(
    (data: DraxDragWithReceiverEventData) => {
      if (data.dragged.payload === payload || isReceiver) {
        hidePlaceholder();
        return;
      }

      showPlaceholder();
    },
    [hidePlaceholder, isReceiver, payload, showPlaceholder],
  );

  const handleContainerReceiveDragExit = useCallback(() => {
    isReceivingNestedItem.value = false;
    hidePlaceholder();
  }, [hidePlaceholder, isReceivingNestedItem]);

  return {
    handleWrapperViewLayout,
    animatedStyle,
    handleContainerReceiveDragDrop,
    handleContainerReceiveDragOver,
    handleContainerReceiveDragEnter,
    handleContainerReceiveDragExit,
    draggableContext,
  };
};

export {useDraggableViewHooks};
