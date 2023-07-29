import {useCallback, useContext, useEffect, useState} from 'react';
import {LayoutChangeEvent} from 'react-native';
import {DraxDragWithReceiverEventData} from 'react-native-drax';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {isEmpty} from '../../../utils/general-utils';
import {DraggableContext} from '../draggable-context';
import {DraggableItem} from '../draggable-context/types';
import {UseDraggableViewHooksProps} from './types';

const PLACEHOLDER_HEIGHT = 50;

const useDraggableViewHooks = <T>({
  payload,
  isReceiver,
}: UseDraggableViewHooksProps<T>) => {
  const draggableContext = useContext(DraggableContext);

  const sortReceiverHeight = useSharedValue<number | undefined>(undefined);
  const isReceivingNestedItem = useSharedValue(false);
  const itemHeight = useSharedValue<number | undefined>(undefined);
  const [isOverDeleter, setOverDeleter] = useState(false);
  const [draggedViewSnapBackAnimationOn, setDraggedViewSnapBackAnimationOn] =
    useState(true);

  const showPlaceholder = useCallback(() => {
    sortReceiverHeight.value = (itemHeight.value ?? 0) + PLACEHOLDER_HEIGHT;
  }, [itemHeight.value, sortReceiverHeight]);

  const hidePlaceholder = useCallback(() => {
    sortReceiverHeight.value = itemHeight.value;
  }, [itemHeight.value, sortReceiverHeight]);

  const castItem = useCallback((item: any) => {
    return item instanceof DraggableItem<T>
      ? (item as DraggableItem<T>)
      : new DraggableItem([item as T]);
  }, []);

  const isGroupedItem = useCallback((item: any) => {
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
      // Find all groups
      const groups = draggableContext.data.slice().filter(x => x.groupId);

      for (let i in groups) {
        const foundIndex = groups[i].data.indexOf(uncastedDraggedItem);
        if (foundIndex >= 0) {
          const newItemList = groups[i].data.slice();
          newItemList.splice(foundIndex, 1);

          groups[i].data = newItemList;
        }
      }
    },
    [draggableContext.data],
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
          isGroupedItem(uncastedDraggedItem) &&
          payload.data.indexOf(uncastedDraggedItem) >= 0;

        if (itsFromThisGroup) {
          return cancelDropping();
        }
      }

      const newList = draggableContext.data.slice();
      const draggedItemIndex = draggableContext.data.indexOf(draggedItem);

      // Remove from the list if found
      if (draggedItemIndex >= 0) {
        newList.splice(draggedItemIndex, 1);
      }

      // If it's an item from a group
      if (isGroupedItem(uncastedDraggedItem)) {
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
      castItem,
      draggableContext,
      hidePlaceholder,
      isGroupedItem,
      isReceivingNestedItem,
      payload,
      removeFromOriginalGroup,
    ],
  );

  const handleContainerReceiveDragOver = useCallback(
    (data: DraxDragWithReceiverEventData) => {
      if (isReceiver) {
        if (data.receiver.receiveOffset.y > PLACEHOLDER_HEIGHT) {
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

  const handleItemDragEnter = useCallback(
    (data: DraxDragWithReceiverEventData) => {
      setDraggedViewSnapBackAnimationOn(false);
      const overDeleter = data.receiver.payload?.id === 'delete';
      setOverDeleter(overDeleter);
    },
    [],
  );

  const handleItemDragExit = useCallback(
    (data: DraxDragWithReceiverEventData) => {
      setDraggedViewSnapBackAnimationOn(true);
      const overDeleter = data.receiver.payload?.id === 'delete';
      setOverDeleter(overDeleter);
    },
    [],
  );
  return {
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
    isOverDeleter,
  };
};

export {useDraggableViewHooks};
