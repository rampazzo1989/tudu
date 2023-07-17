import React, {memo, useContext, useEffect, useRef, useState} from 'react';
import {DraxView} from 'react-native-drax';
import Animated, {
  Layout,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {DraggableContext} from '../../contexts/draggable-context';
import {isEmpty} from '../../utils/general-utils';
import {DraggableViewProps} from './types';

const PLACEHOLDER_HEIGHT = 50;

const DraggableView = memo<DraggableViewProps<any>>(
  ({payload, isReceiver = false, children}) => {
    const draggableContext = useContext(DraggableContext);

    const sortReceiverHeight = useSharedValue<number | undefined>(undefined);
    const isReceivingNestedItem = useSharedValue(false);
    const [draggedViewSnapBackAnimation, setDraggedViewSnapBackAnimation] =
      useState(true);

    const itemHeight = useSharedValue<number | undefined>(undefined);

    useEffect(() => {
      console.log({draggableContext});

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
          console.log('ONLAYOUT', event.nativeEvent.layout.height);

          itemHeight.value =
            itemHeight.value ?? event.nativeEvent.layout.height;
        }}>
        <DraxView
          isParent
          onReceiveDragDrop={data => {
            sortReceiverHeight.value = itemHeight.value;
            const draggedItem = data.dragged.payload;
            const draggedItemIndex = draggableContext.data.indexOf(draggedItem);
            const newList = draggableContext.data.slice();

            if (draggedItemIndex !== -1) {
              newList.splice(draggedItemIndex, 1);
            }

            if (isReceivingNestedItem.value) {
              console.log('HOLA', data.dragged.payload, {draggedItemIndex});

              draggableContext.onItemReceiving(payload, draggedItem);
            } else {
              const currentItemIndex = newList.indexOf(payload);
              newList.splice(currentItemIndex, 0, draggedItem);
              draggableContext.setData(newList);
            }

            isReceivingNestedItem.value = false;
          }}
          onReceiveDragOver={data => {
            if (isReceiver) {
              if (data.receiver.receiveOffset.y > PLACEHOLDER_HEIGHT) {
                isReceivingNestedItem.value = true;
                sortReceiverHeight.value = itemHeight.value;
                console.log('EMBAIXO', {y: data.receiver.receiveOffsetRatio.y});
              } else {
                isReceivingNestedItem.value = false;
                if (data.dragged.payload !== payload) {
                  sortReceiverHeight.value =
                    (itemHeight.value ?? 0) + PLACEHOLDER_HEIGHT;
                }
              }
            } else {
              isReceivingNestedItem.value = false;
            }
          }}
          onReceiveDragEnter={data => {
            if (data.dragged.payload === payload || isReceiver) {
              console.log(
                'AAAAAAAAAAAAAAAAAAAA',
                itemHeight.value,
                sortReceiverHeight.value,
              );

              sortReceiverHeight.value = itemHeight.value;
              return;
            }

            sortReceiverHeight.value =
              (itemHeight.value ?? 0) + PLACEHOLDER_HEIGHT;

            console.log('>>>>>', {
              itemHeight: itemHeight.value,
              PLACEHOLDER_HEIGHT,
              sortReceiverHeight: sortReceiverHeight.value,
            });
          }}
          onReceiveDragExit={data => {
            isReceivingNestedItem.value = false;
            sortReceiverHeight.value = itemHeight.value;
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
            // onDrag={data => console.log(data)}
            // onDragOver={data => {
            //   const receiverOffsetY = data.receiver.receiveOffsetRatio.y;
            //   const receiver = data.receiver.payload?.text;
            //   if (receiverOffsetY > 0.8) {
            //     console.log('OVER', {receiver});
            //   }
            // }}
            hoverStyle={{elevation: 15}}
            receivingStyle={{opacity: 0.6}}
            payload={payload}
            // onReceiveDragEnter={data => {
            //   if (data.dragged.payload === payload) {
            //     sortReceiverHeight.value = 50;
            //     return;
            //   }
            //   sortReceiverHeight.value = 96;
            // }}
            // onReceiveDragExit={data => {
            //   sortReceiverHeight.value = 50;
            // }}
            onReceiveDragDrop={event => {
              let selected_item = event.dragged.payload;
              console.log('AQUI', itemHeight.value);
            }}
            onDragEnter={data => {
              setDraggedViewSnapBackAnimation(false);
            }}
            onDragExit={data => {
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
  },
);

export {DraggableView};
