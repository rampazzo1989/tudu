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
import {
  DraggableItem,
  SpecialDraggablePayload,
} from '../../modules/draggable/draggable-context/types';
import {useTranslation} from 'react-i18next';
import {AnimatedIconRef} from '../animated-icons/animated-icon/types';
import Toast from 'react-native-toast-message';
import {ListViewModel} from '../../scenes/home/types';
import {refreshListState} from '../../modules/draggable/draggable-utils';
import {showItemDeletedToast} from '../../utils/toast-utils';
import {getTypeItemOrGroup} from '../../utils/list-and-group-utils';
import {capitalizeFirstLetter} from '../../utils/string-utils';

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

    const previousStateData = useRef(JSON.stringify(draggableContext.data));

    const handleUndoDeletePress = useCallback(() => {
      try {
        const parsedOldState: DraggableItem<ListViewModel>[] = JSON.parse(
          previousStateData.current,
        );

        refreshListState(parsedOldState, draggableContext.setData);
        Toast.hide();
      } catch (e) {
        console.log(previousStateData.current);
        Toast.show({
          type: 'error',
          position: 'bottom',
          bottomOffset: 60,
          text1: e,
        });
      }
    }, [draggableContext.setData]);

    const handleDrop = useCallback(
      (data: DraxDragWithReceiverEventData) => {
        previousStateData.current = JSON.stringify(draggableContext.data);
        const itemType = getTypeItemOrGroup(data.dragged.payload);
        const capitalizedItemType = capitalizeFirstLetter(itemType);
        return draggableContext.showConfirmationModal(
          data.dragged.payload,
          confirmationPopupTitleBuilder,
          'delete',
          undefined,
          () => {
            animateIcon?.(DeleteIconActionAnimation);
            showItemDeletedToast(
              t('toast.itemDeleted', {itemType: capitalizedItemType}),
              handleUndoDeletePress,
            );
          },
        );
      },
      [
        animateIcon,
        confirmationPopupTitleBuilder,
        draggableContext,
        handleUndoDeletePress,
        t,
      ],
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
