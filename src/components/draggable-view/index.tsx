import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {DraxView} from 'react-native-drax';
import Animated, {
  Layout,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {DraggableContext} from '../../contexts/draggable-context';
import {DraggableItem} from '../../contexts/draggable-context/types';
import {isEmpty} from '../../utils/general-utils';
import {DraggableViewProps} from './types';
import Reactotron from 'reactotron-react-native';

const PLACEHOLDER_HEIGHT = 50;

const DraggableView = <T,>({
  payload,
  isReceiver = false,
  children,
}: DraggableViewProps<T>) => {
  const draggableContext = useContext(DraggableContext);

  const sortReceiverHeight = useSharedValue<number | undefined>(undefined);
  const isReceivingNestedItem = useSharedValue(false);
  const [draggedViewSnapBackAnimation, setDraggedViewSnapBackAnimation] =
    useState(true);

  const itemHeight = useSharedValue<number | undefined>(undefined);

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

  return (
    <Animated.View
      layout={Layout.springify()}
      style={animatedStyle}
      onLayout={event => {
        itemHeight.value = itemHeight.value ?? event.nativeEvent.layout.height;
      }}>
      <DraxView
        isParent
        onReceiveDragDrop={data => {
          hidePlaceholder();
          const newList = draggableContext.data.slice();

          const draggedItem = castItem(data.dragged.payload);
          const draggedItemIndex = draggableContext.data.indexOf(draggedItem);

          // Remove from the list if found
          if (draggedItemIndex !== -1) {
            console.log('REMOVING', {draggedItemIndex});

            newList.splice(draggedItemIndex, 1);
          }

          if (isReceivingNestedItem.value && payload.groupId) {
            payload.data = payload.data.concat(draggedItem.data);
            console.log('ADDING', {newPayload: payload.data});
          } else {
            const currentItemIndex = newList.indexOf(payload);
            newList.splice(currentItemIndex, 0, draggedItem);

            const uncastedDraggedItem = data.dragged.payload;

            // If it's an item
            if (isGroupedItem(uncastedDraggedItem)) {
              // Find all groups
              const groups = draggableContext.data
                .slice()
                .filter(x => x.groupId);

              for (let i in groups) {
                const foundIndex = groups[i].data.indexOf(uncastedDraggedItem);
                if (foundIndex >= 0) {
                  const newItemList = groups[i].data.slice();
                  newItemList.splice(foundIndex, 1);

                  groups[i].data = newItemList;
                }
              }
            }
          }

          draggableContext.setData(newList);

          isReceivingNestedItem.value = false;
        }}
        onReceiveDragOver={data => {
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
        }}
        onReceiveDragEnter={data => {
          if (data.dragged.payload === payload || isReceiver) {
            hidePlaceholder();
            return;
          }

          showPlaceholder();
        }}
        onReceiveDragExit={() => {
          isReceivingNestedItem.value = false;
          hidePlaceholder();
        }}
        style={[
          {
            alignContent: 'center',
            justifyContent: 'flex-end',
            flexGrow: 1,
          },
        ]}>
        {/* <DropHere autoPlay loop /> */}

        <DraxView
          isParent={isReceiver}
          animateSnapback={draggedViewSnapBackAnimation}
          draggable
          longPressDelay={300}
          draggingStyle={{
            opacity: 0.2,
            backgroundColor: 'transparent',
          }}
          hoverStyle={{elevation: 15}}
          receivingStyle={{opacity: 0.6}}
          payload={payload}
          onDragEnter={() => {
            setDraggedViewSnapBackAnimation(false);
          }}
          onDragExit={() => {
            setDraggedViewSnapBackAnimation(true);
          }}
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
            },
            {backgroundColor: 'transparent'},
          ]}>
          {children}
        </DraxView>
      </DraxView>
    </Animated.View>
  );
};

export {DraggableView};
