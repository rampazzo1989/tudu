import React, {memo, useCallback, useContext, useEffect, useState} from 'react';
import {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {DeleteIcon} from '../animated-icons/delete-icon';
import {AnimatedContainer, Container, Label, styles} from './styles';
import {FloatingDeleteProps} from './types';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {DraggableContext} from '../../modules/draggable/draggable-context';
import {DraxDragWithReceiverEventData} from 'react-native-drax';
import {SpecialDraggablePayload} from '../../modules/draggable/draggable-context/types';
import {useTranslation} from 'react-i18next';

const deletePayload: SpecialDraggablePayload = {
  id: 'delete',
};

const FloatingDelete: React.FC<FloatingDeleteProps> = memo(
  ({visible, confirmationPopupTitleBuilder}) => {
    const [animate, setAnimate] = useState(false);
    const draggableContext = useContext(DraggableContext);
    const {t} = useTranslation();

    const handleItemIsHovering = useCallback(() => {
      ReactNativeHapticFeedback.trigger('rigid');
      setAnimate(true);
    }, []);

    useEffect(() => {
      if (!visible) {
        setAnimate(false);
      }
    }, [visible]);

    const handleDrop = useCallback(
      (data: DraxDragWithReceiverEventData) => {
        return draggableContext.showDeleteConfirmationModal(
          data.dragged.payload,
          confirmationPopupTitleBuilder,
        );
      },
      [confirmationPopupTitleBuilder, draggableContext],
    );

    const handleReceiveDragExit = useCallback(() => setAnimate(false), []);

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
      </>
    );
  },
);

export {FloatingDelete};
