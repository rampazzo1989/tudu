import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {FadeIn, LinearTransition, SlideInRight} from 'react-native-reanimated';
import {TuduViewModel} from '../../scenes/home/types';
import {showItemDeletedToast} from '../../utils/toast-utils';
import {SwipeableCardRef} from '../swipeable-card/types';
import {TuduCard} from '../tudu-card';
import {TuduAnimatedContainer} from './styles';
import {SimpleTuduListProps} from './types';
import {isToday} from '../../utils/date-utils';
import { SwipeableTuduCard } from '../tudu-card/swipeable-tudu-card';
import { ShrinkableView } from '../shrinkable-view';

const LayoutAnimation = LinearTransition.springify().stiffness(300).damping(13).mass(0.3);
/**
 * A non-draggable, non-addable tudu list.
 */
const SimpleTuduList: React.FC<SimpleTuduListProps> = memo(
  ({
    tudus,
    getAdditionalInformation,
    deleteTuduFn,
    updateTuduFn,
    undoDeletionFn,
    onEditPress,
  }) => {
    const {t} = useTranslation();

    const handleDeleteGenerator = useCallback(
      (deletingItem: TuduViewModel) => () => {
        deleteTuduFn(deletingItem);
        showItemDeletedToast(t('toast.tuduDeleted'), () => undoDeletionFn());
      },
      [deleteTuduFn, t, undoDeletionFn],
    );

    const handleEditGenerator = useCallback(
      (editingItem: TuduViewModel) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          onEditPress(editingItem);
          swipeableRef.current?.closeOptions();
        },
      [onEditPress],
    );

    const handleTuduPress = useCallback(
      (editingItem: TuduViewModel) => {
        editingItem.done = !editingItem.done;
        updateTuduFn(editingItem);
      },
      [updateTuduFn],
    );

    const handleStarPress = useCallback(
      (editingItem: TuduViewModel) => {
        editingItem.starred = !editingItem.starred;
        updateTuduFn(editingItem);
      },
      [updateTuduFn],
    );

    const handleSendToOrRemoveFromTodayGenerator = useCallback(
      (editingItem: TuduViewModel) =>
        (swipeableRef: React.RefObject<SwipeableCardRef>) => {
          const dueDate = editingItem.dueDate;
          if (dueDate && isToday(dueDate)) {
            editingItem.dueDate = undefined;
            editingItem.scheduledOrder = undefined;
          } else {
            editingItem.dueDate = new Date();
          }
          updateTuduFn(editingItem);
          swipeableRef.current?.closeOptions();
        },
      [updateTuduFn],
    );

    return (
      <>
        {tudus.map((tudu, index) => {
          return (
            <TuduAnimatedContainer
              entering={FadeIn?.duration(100).delay(index * 50)}
              key={`${tudu.id}`} layout={LayoutAnimation}>
                <ShrinkableView onPress={() => handleTuduPress(tudu)} scaleFactor={0.03} 
                  style={{ height: 'auto', width: '100%', zIndex: tudu.done ? 0 : 9999, marginBottom: 8}} >
                    <SwipeableTuduCard
                          done={tudu.done}
                          onDelete={handleDeleteGenerator(tudu)}
                          onEdit={handleEditGenerator(tudu)}
                          isOnToday={tudu.dueDate && isToday(tudu.dueDate)}
                          onSendToOrRemoveFromToday={handleSendToOrRemoveFromTodayGenerator(
                            tudu,
                          )}>
                      <TuduCard
                          data={tudu}
                          onPress={handleTuduPress}
                          onStarPress={handleStarPress}
                          additionalInfo={getAdditionalInformation(tudu)}
                        />
                    </SwipeableTuduCard>
                </ShrinkableView>
            </TuduAnimatedContainer>
          );
        })}
      </>
    );
  },
);

export {SimpleTuduList};
