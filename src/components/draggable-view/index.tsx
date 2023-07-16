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

const DraggableView = memo<DraggableViewProps<any>>(
  ({payload, isReceiver = false, children}) => {
    const draggableContext = useContext(DraggableContext);

    const sortReceiverHeight = useSharedValue(50);
    const isReceivingNestedItem = useSharedValue(false);
    const [draggedViewSnapBackAnimation, setDraggedViewSnapBackAnimation] =
      useState(true);

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
        marginTop: 4,
        opacity: isReceivingNestedItem.value ? 0.5 : 1,
      };
    }, []);

    return (
      <Animated.View layout={Layout.springify()} style={animatedStyle}>
        <DraxView
          isParent
          onReceiveDragDrop={data => {
            sortReceiverHeight.value = 50;
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
            console.log(
              'ENTER PARENT',
              payload?.label,
              data.dragged.payload === payload,
            );

            if (data.dragged.payload === payload) {
              sortReceiverHeight.value = 50;
              return;
            }
            sortReceiverHeight.value = 96;
          }}
          onReceiveDragExit={data => {
            console.log('EXIT PARENT');
            isReceivingNestedItem.value = false;
            sortReceiverHeight.value = 50;
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
              console.log('AQUI');
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
