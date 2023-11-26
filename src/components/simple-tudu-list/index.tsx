import React, {memo, useCallback, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {SlideInRight} from 'react-native-reanimated';
import {DraggableContext} from '../../modules/draggable/draggable-context';
import {
  DraggableContextType,
  DraggableItem,
} from '../../modules/draggable/draggable-context/types';
import {
  deleteItem,
  refreshListState,
} from '../../modules/draggable/draggable-utils';
import {TuduViewModel} from '../../scenes/home/types';
import {showItemDeletedToast} from '../../utils/toast-utils';
import {SwipeableCardRef} from '../swipeable-card/types';
import {TuduCard} from '../tudu-card';
import {TuduAnimatedContainer} from './styles';
import {SimpleTuduListProps} from './types';
import Toast from 'react-native-toast-message';

/**
 * A non-draggable, non-addable tudu list.
 */
const SimpleTuduList: React.FC<SimpleTuduListProps> = memo(
  ({onTuduPress, getAdditionalInformation}) => {
    const {t} = useTranslation();

    const draggableContext =
      useContext<DraggableContextType<TuduViewModel>>(DraggableContext);

    const handleUndoDeletion = useCallback(
      (
        list: DraggableItem<TuduViewModel>[],
        listSetter: (newData: DraggableItem<TuduViewModel>[]) => void,
      ) => {
        refreshListState(list, listSetter);
        Toast.hide();
      },
      [],
    );

    const handleDeleteGenerator = useCallback(
      (deletingItem: DraggableItem<TuduViewModel>) => () => {
        deleteItem(
          draggableContext.data,
          newData => draggableContext.setData(newData, true),
          deletingItem,
        );

        showItemDeletedToast(t('toast.tuduDeleted'), () =>
          handleUndoDeletion(draggableContext.data, draggableContext.setData),
        );
      },
      [draggableContext, handleUndoDeletion, t],
    );

    const handleEditGenerator = useCallback(
      (editingItem: DraggableItem<TuduViewModel>) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          onEditPress(editingItem.data[0]);
          swipeableRef.current?.closeOptions();
        },
      [onEditPress],
    );
    return (
      <>
        {tudus.map((tudu, index) => {
          return (
            <TuduAnimatedContainer
              entering={SlideInRight?.duration(100).delay(index * 50)}>
              <TuduCard
                data={tudu}
                onPress={onTuduPress}
                onDelete={handleDeleteGenerator(tudu)}
                onEdit={handleEditGenerator(tudu)}
                onSendToOrRemoveFromToday={handleSendToOrRemoveFromTodayGenerator(
                  tudu,
                )}
                additionalInfo={getAdditionalInformation(tudu)}
              />
            </TuduAnimatedContainer>
          );
        })}
      </>
    );
  },
);

export {SimpleTuduList};
