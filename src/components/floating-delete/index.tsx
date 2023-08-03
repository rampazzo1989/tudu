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
import {PopupModal} from '../popup-modal';

const deletePayload: SpecialDraggablePayload = {
  id: 'delete',
};

const FloatingDelete: React.FC<FloatingDeleteProps> = memo(
  ({visible, confirmationPopupTitleBuilder}) => {
    const [animate, setAnimate] = useState(false);
    const [deletingItem, setDeletingItem] = useState<DraggableItem<unknown>>();
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

    const handleDrop = useCallback((data: DraxDragWithReceiverEventData) => {
      setDeletingItem(data.dragged.payload);
      return setModal(true);
    }, []);

    const handleConfirmDelete = useCallback(() => {
      if (!deletingItem) {
        return;
      }
      const cloneList = draggableContext?.data?.slice();
      const isSubItem = isNestedItem(deletingItem);

      if (isSubItem) {
        removeSubItem(cloneList, deletingItem);
      } else {
        const index = cloneList?.indexOf(deletingItem);
        cloneList?.splice(index, 1);
      }

      draggableContext?.setData(cloneList);
      setModal(false);
    }, [deletingItem, draggableContext, isNestedItem]);

    const handleCancelDelete = useCallback(() => {
      setDeletingItem(undefined);
      setModal(false);
    }, []);

    const handleReceiveDragExit = useCallback(() => setAnimate(false), []);

    const [modal, setModal] = useState(false);

    return (
      <>
        {visible ? (
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
        ) : undefined}
        <PopupModal
          visible={modal}
          onRequestClose={() => setModal(false)}
          title={confirmationPopupTitleBuilder(deletingItem)}
          buttons={[
            {label: 'Sim', onPress: handleConfirmDelete},
            {label: 'Não', onPress: handleCancelDelete},
          ]}
          Icon={DeleteIcon}
        />
      </>
    );
  },
);

export {FloatingDelete};
