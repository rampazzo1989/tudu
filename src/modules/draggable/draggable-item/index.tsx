import React, {memo, useCallback, useContext, useRef, useState} from 'react';
import {DraxDragWithReceiverEventData, DraxView} from 'react-native-drax';
import {useSetRecoilState} from 'recoil';
import {DraggableContext} from '../draggable-context';
import {
  SpecialDraggablePayload,
  SPECIAL_DRAGGABLE_PAYLOAD_TYPES,
} from '../draggable-context/types';
import {draggedItemHeight} from '../state';
import {styles} from './styles';
import {DraggableItemProps} from './types';

/**
 * Type guard function to check if a payload belongs to a special reciever, i.e. a view that can handle a dragged item and do some action with it (delete, move, etc).
 * @param payload The unncasted payload to check and type conditionally.
 * @returns True if the condition matches, and the return will be considered casted to the SpecialDraggablePayload from then on. False otherwise.
 */
function isSpecialDraggable(payload: any): payload is SpecialDraggablePayload {
  return payload?.id && SPECIAL_DRAGGABLE_PAYLOAD_TYPES.includes(payload.id);
}

const DraggableItem: React.FC<DraggableItemProps> = memo(
  ({children, ...props}) => {
    const [isOverDeleter, setOverDeleter] = useState(false);
    const itemHeight = useRef(50);
    const [draggedViewSnapBackAnimationOn, setDraggedViewSnapBackAnimationOn] =
      useState(true);

    const setDraggedItemHeight = useSetRecoilState(draggedItemHeight);

    const draggableContext = useContext(DraggableContext);

    const handleOverSpecialReceiver = useCallback(
      (receiverPayload: any, isOverReceiver: boolean) => {
        if (isSpecialDraggable(receiverPayload)) {
          if (receiverPayload.id === 'delete') {
            setOverDeleter(isOverReceiver);
          }
        }
      },
      [],
    );

    const handleItemDragEnter = useCallback(
      (data: DraxDragWithReceiverEventData) => {
        setDraggedViewSnapBackAnimationOn(false);
        handleOverSpecialReceiver(data.receiver.payload, true);
      },
      [handleOverSpecialReceiver],
    );

    const handleItemDragExit = useCallback(
      (data: DraxDragWithReceiverEventData) => {
        setDraggedViewSnapBackAnimationOn(true);
        handleOverSpecialReceiver(data.receiver.payload, false);
      },
      [handleOverSpecialReceiver],
    );

    const handleItemDragDrop = useCallback(
      (data: DraxDragWithReceiverEventData) => {
        handleOverSpecialReceiver(data.receiver.payload, false);
        draggableContext?.onDragEnd?.();
      },
      [draggableContext, handleOverSpecialReceiver],
    );

    const handleItemDragStart = useCallback(() => {
      setDraggedItemHeight(itemHeight.current);
      draggableContext?.onDragStart?.();
    }, [draggableContext, itemHeight, setDraggedItemHeight]);

    const handleItemDragEnd = useCallback(() => {
      setDraggedItemHeight(50);
    }, [setDraggedItemHeight]);

    return (
      <DraxView
        animateSnapback={draggedViewSnapBackAnimationOn}
        draggable
        onSnapbackEnd={draggableContext?.onDragEnd}
        longPressDelay={700}
        draggingStyle={styles.itemDragging}
        hoverStyle={isOverDeleter ? styles.itemHoverDeleter : styles.itemHover}
        receivingStyle={styles.itemReceiving}
        onDragEnter={handleItemDragEnter}
        onDragExit={handleItemDragExit}
        onDragStart={handleItemDragStart}
        onDragEnd={handleItemDragEnd}
        onDragDrop={handleItemDragDrop}
        onLayout={e => {
          const height = e.nativeEvent.layout.height || 50;
          itemHeight.current = height + 4;
          setDraggedItemHeight(itemHeight.current);
        }}
        style={[styles.item, props.style]}
        {...props}>
        {children}
      </DraxView>
    );
  },
);

export {DraggableItem};
