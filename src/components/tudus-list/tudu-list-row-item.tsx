import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import { ScaleDecorator, ShadowDecorator } from 'react-native-draggable-flatlist';
import { TuduViewModel } from '../../scenes/home/types';
import { isToday } from '../../utils/date-utils';
import { ShrinkableView } from '../shrinkable-view';
import { SwipeableCardRef } from '../swipeable-card/types';
import { TuduCard } from '../tudu-card';
import { SwipeableTuduCard } from '../tudu-card/swipeable-tudu-card';
import { TuduAdditionalInformation } from '../tudu-card/types';

export interface TuduListRowItemProps {
  tudu: TuduViewModel;
  isActive: boolean;
  isDraggable: boolean;
  drag?: () => void;
  onTuduPress: (tudu: TuduViewModel) => void;
  onStarPress: (tudu: TuduViewModel) => void;
  onDelete: (tudu: TuduViewModel) => void;
  onEdit: (tudu: TuduViewModel) => void;
  onSchedule: (tudu: TuduViewModel) => void;
  onSendToOrRemoveFromToday: (tudu: TuduViewModel, swipeableRef: React.RefObject<SwipeableCardRef>) => void;
  additionalInfo?: TuduAdditionalInformation;
  allowSchedule?: boolean;
}

function areRowPropsEqual(prev: TuduListRowItemProps, next: TuduListRowItemProps): boolean {
  if (prev.isActive !== next.isActive) return false;
  if (prev.isDraggable !== next.isDraggable) return false;
  if (prev.allowSchedule !== next.allowSchedule) return false;
  if (prev.tudu.id !== next.tudu.id) return false;
  if (prev.tudu.done !== next.tudu.done) return false;
  if (prev.tudu.starred !== next.tudu.starred) return false;
  if (prev.tudu.label !== next.tudu.label) return false;
  if (prev.tudu.dueDate?.getTime() !== next.tudu.dueDate?.getTime()) return false;
  if (prev.tudu.recurrence !== next.tudu.recurrence) return false;
  if (prev.tudu.sectionId !== next.tudu.sectionId) return false;
  if (prev.additionalInfo?.label !== next.additionalInfo?.label) return false;
  if (prev.additionalInfo?.originType !== next.additionalInfo?.originType) return false;
  return true;
}

export const TuduListRowItem = memo<TuduListRowItemProps>(
  ({
    tudu,
    isActive,
    isDraggable,
    drag,
    onTuduPress,
    onStarPress,
    onDelete,
    onEdit,
    onSchedule,
    onSendToOrRemoveFromToday,
    additionalInfo,
    allowSchedule = true,
  }) => {
    const handlePress = useCallback(() => {
      onTuduPress(tudu);
    }, [onTuduPress, tudu]);

    const handleDelete = useCallback(() => {
      onDelete(tudu);
    }, [onDelete, tudu]);

    const handleEdit = useCallback(
      (swipeableRef: React.RefObject<SwipeableCardRef>) => {
        onEdit(tudu);
        swipeableRef.current?.closeOptions();
      },
      [onEdit, tudu],
    );

    const handleSchedule = useCallback(
      (swipeableRef: React.RefObject<SwipeableCardRef>) => {
        onSchedule(tudu);
      },
      [onSchedule, tudu],
    );

    const handleSendToOrRemove = useCallback(
      (swipeableRef: React.RefObject<SwipeableCardRef>) => {
        onSendToOrRemoveFromToday(tudu, swipeableRef);
      },
      [onSendToOrRemoveFromToday, tudu],
    );

    const content = (
      <ShrinkableView
        onPress={handlePress}
        scaleFactor={0.03}
        style={{
          width: '100%',
          zIndex: isDraggable ? 9999 : 0,
          marginBottom: 8,
        }}
        onLongPress={isDraggable ? drag : undefined}
        disabled={isActive}>
        <SwipeableTuduCard
          enabled={!isActive}
          done={tudu.done}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSchedule={handleSchedule}
          isOnToday={Boolean(tudu.dueDate && isToday(tudu.dueDate))}
          onSendToOrRemoveFromToday={handleSendToOrRemove}
          allowSchedule={allowSchedule && tudu.origin !== 'archived'}>
          <TuduCard
            data={tudu}
            onPress={onTuduPress}
            onStarPress={onStarPress}
            additionalInfo={additionalInfo}
          />
        </SwipeableTuduCard>
      </ShrinkableView>
    );

    if (isDraggable) {
      return (
        <ScaleDecorator activeScale={1.05}>
          {content}
        </ScaleDecorator>
      );
    }

    return content;
  },
  areRowPropsEqual,
);
