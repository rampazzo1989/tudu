import React, {memo, useCallback, useContext, useEffect, useRef} from 'react';
import {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {
  DeleteIcon,
  DeleteIconActionAnimation,
} from '../animated-icons/delete-icon';
import {AnimatedContainer, Container, Label, styles} from './styles';
import {FloatingDeleteProps} from './types';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {DraggableContext} from '../../modules/draggable/draggable-context';
import {DraxDragWithReceiverEventData} from 'react-native-drax';
import {SpecialDraggablePayload} from '../../modules/draggable/draggable-context/types';
import {useTranslation} from 'react-i18next';
import {AnimatedIconRef} from '../animated-icons/animated-icon/types';

const deletePayload: SpecialDraggablePayload = {
  id: 'delete',
};

const FloatingDelete: React.FC<FloatingDeleteProps> = memo(
  ({visible, confirmationPopupTitleBuilder, animateIcon}) => {
    const draggableContext = useContext(DraggableContext);
    const {t} = useTranslation();
    const iconRef = useRef<AnimatedIconRef>(null);

    const handleItemIsHovering = useCallback(() => {
      ReactNativeHapticFeedback.trigger('rigid');
      iconRef.current?.play();
    }, []);

    useEffect(() => {
      if (!visible) {
        iconRef.current?.pause();
      }
    }, [visible]);

    const handleDrop = useCallback(
      (data: DraxDragWithReceiverEventData) => {
        return draggableContext.showConfirmationModal(
          data.dragged.payload,
          confirmationPopupTitleBuilder,
          'delete',
          undefined,
          () => animateIcon?.(DeleteIconActionAnimation),
        );
      },
      [animateIcon, confirmationPopupTitleBuilder, draggableContext],
    );

    const handleReceiveDragExit = useCallback(
      () => iconRef.current?.pause(),
      [],
    );

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
              <DeleteIcon loop size={24} ref={iconRef} />
              <Label>{t('actions.delete')}</Label>
            </Container>
          </AnimatedContainer>
        ) : undefined}
      </>
    );
  },
);

export {FloatingDelete};
