import React, {memo, useCallback, useContext, useEffect, useState} from 'react';
import {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {DeleteIcon} from '../animated-icons/delete-icon';
import {AnimatedContainer, Container, Label, styles} from './styles';
import {FloatingDeleteProps} from './types';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {DraggableContext} from '../../modules/draggable/draggable-context';
import {DraxDragWithReceiverEventData} from 'react-native-drax';
import {
  DraggableItem,
  SpecialDraggablePayload,
} from '../../modules/draggable/draggable-context/types';
import {useTranslation} from 'react-i18next';
import {removeSubItem} from '../../modules/draggable/draggable-utils';

const deletePayload: SpecialDraggablePayload = {
  id: 'delete',
};

const FloatingDelete: React.FC<FloatingDeleteProps> = memo(({visible}) => {
  const [animate, setAnimate] = useState(false);
  const draggableContext = useContext(DraggableContext);
  const {t} = useTranslation();

  const handleItemIsHovering = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
    setAnimate(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      setAnimate(false);
    }
  }, [visible]);

  const isNestedItem = useCallback(<T,>(item: T) => {
    return !(item instanceof DraggableItem<T>);
  }, []);

  const handleDrop = useCallback(
    (data: DraxDragWithReceiverEventData) => {
      const cloneList = draggableContext?.data?.slice();
      const payload = data.dragged.payload;
      const isSubItem = isNestedItem(payload);

      if (isSubItem) {
        removeSubItem(cloneList, payload);
      } else {
        const index = cloneList?.indexOf(payload);
        cloneList?.splice(index, 1);
      }

      draggableContext?.setData(cloneList);
    },
    [draggableContext, isNestedItem],
  );

  const handleReceiveDragExit = useCallback(() => setAnimate(false), []);

  return visible ? (
    <AnimatedContainer entering={SlideInDown} exiting={SlideOutDown}>
      <Container
        payload={deletePayload}
        onReceiveDragEnter={handleItemIsHovering}
        onReceiveDragExit={handleReceiveDragExit}
        onReceiveDragDrop={handleDrop}
        receivingStyle={styles.receivingStyle}>
        <DeleteIcon loop animate={animate} />
        <Label>{t('actions.delete')}</Label>
      </Container>
    </AnimatedContainer>
  ) : (
    <></>
  );
});

export {FloatingDelete};
