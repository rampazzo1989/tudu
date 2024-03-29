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
import {showItemDeletedToast} from '../../utils/toast-utils';
import {getTypeItemOrGroup} from '../../utils/list-and-group-utils';
import {capitalizeFirstLetter} from '../../utils/string-utils';
import {isNestedItem} from '../../modules/draggable/draggable-utils';
import {ListDataViewModel} from '../../scenes/home/types';

const deletePayload: SpecialDraggablePayload = {
  id: 'delete',
};

const FloatingDelete: React.FC<FloatingDeleteProps> = memo(
  ({
    visible,
    confirmationPopupTitleBuilder,
    deleteItemsFn,
    undoDeletionFn,
    animateIcon,
  }) => {
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
        const payload = data.dragged.payload as
          | ListDataViewModel
          | DraggableItem<ListDataViewModel>;
        const itemType = getTypeItemOrGroup(payload);
        const capitalizedItemType = capitalizeFirstLetter(itemType);

        let viewModelList: ListDataViewModel[] | undefined;

        if (isNestedItem(payload)) {
          viewModelList = [payload];
        } else {
          viewModelList = payload.data;
        }

        return draggableContext.showConfirmationModal(
          data.dragged.payload,
          confirmationPopupTitleBuilder,
          'delete',
          undefined,
          () => {
            deleteItemsFn(viewModelList);
            animateIcon?.(DeleteIconActionAnimation);
            showItemDeletedToast(
              t('toast.itemDeleted', {itemType: capitalizedItemType}),
              undoDeletionFn,
            );
          },
        );
      },
      [
        animateIcon,
        confirmationPopupTitleBuilder,
        deleteItemsFn,
        draggableContext,
        t,
        undoDeletionFn,
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
