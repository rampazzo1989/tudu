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
            console.log('HOLA', itemHeight.value);
            sortReceiverHeight.value = itemHeight.value;
            isReceivingNestedItem.value = false;
            const draggedItem = data.dragged.payload;
            const draggedItemIndex = draggableContext.data.indexOf(draggedItem);
            const newList = draggableContext.data.slice();
            newList.splice(draggedItemIndex, 1);
            const currentItemIndex = newList.indexOf(payload);
            newList.splice(currentItemIndex, 0, draggedItem);
            console.log({currentItemIndex, draggedItem, draggedItemIndex});

            draggableContext.setData(newList);
          }}
          onReceiveDragOver={data => {
            if (isReceiver && data.receiver.receiveOffsetRatio.y > 0.5) {
              isReceivingNestedItem.value = true;
              console.log('EMBAIXO', {y: data.receiver.receiveOffsetRatio.y});
            } else {
              isReceivingNestedItem.value = false;
            }
          }}
          onReceiveDragEnter={data => {
            if (data.dragged.payload === payload) {
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
          // receivingStyle={[
          //   {
          //     height: 46,
          //   },
          // ]}
          style={[
            {
              alignContent: 'center',
              justifyContent: 'flex-end',
              flexGrow: 1,
            },
          ]}>
          {/* <DropHere autoPlay loop /> */}

          <DraxView
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
