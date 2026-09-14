import React, { memo, useCallback, useState } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: '100%',
  },
});
import { TuduViewModel } from '../../scenes/home/types';
import { showItemDeletedToast } from '../../utils/toast-utils';
import { SwipeableCardRef } from '../swipeable-card/types';
import { SimpleTuduListProps } from './types';
import { isToday } from '../../utils/date-utils';
import { useCloseCurrentlyOpenSwipeable } from '../../hooks/useCloseAllSwipeables';
import { updateRecurrenceFromDate } from '../../utils/tudu-utils';
import { SendToTodayModal } from '../send-to-today-modal';
import { TuduListRowItem } from '../tudus-list/tudu-list-row-item';

/**
 * A non-draggable, non-addable tudu list.
 * Virtualized with FlatList by default for high performance with long lists.
 */
const SimpleTuduList: React.FC<SimpleTuduListProps> = memo(
  ({
    tudus,
    getAdditionalInformation,
    deleteTuduFn,
    updateTuduFn,
    undoDeletionFn,
    onEditPress,
    onSchedulePress,
    virtualized = true,
    contentContainerStyle,
    style,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
  }) => {
    const { t } = useTranslation();
    const [tuduWaitingForConfirmation, setTuduWaitingForConfirmation] = useState<TuduViewModel | null>(null);
    const { closeCurrentlyOpenSwipeable } = useCloseCurrentlyOpenSwipeable();

    const handleDelete = useCallback(
      (deletingItem: TuduViewModel) => {
        deleteTuduFn(deletingItem);
        showItemDeletedToast(t('toast.tuduDeleted'), () => undoDeletionFn());
      },
      [deleteTuduFn, t, undoDeletionFn],
    );

    const handleEdit = useCallback(
      (editingItem: TuduViewModel) => {
        onEditPress(editingItem);
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

    const sendToToday = useCallback(
      (editingItem: TuduViewModel) => {
        editingItem.dueDate = new Date();
        updateTuduFn(editingItem);
      },
      [updateTuduFn],
    );

    const removeFromToday = useCallback(
      (editingItem: TuduViewModel) => {
        const dueDate = editingItem.dueDate;
        if (dueDate && isToday(dueDate)) {
          if (editingItem.recurrence) {
            const tomorrowAsBaseDate = new Date();
            tomorrowAsBaseDate.setDate(tomorrowAsBaseDate.getDate() + 1);
            const updatedTudu = updateRecurrenceFromDate(editingItem, tomorrowAsBaseDate);
            updatedTudu.scheduledOrder = undefined;
            updateTuduFn(updatedTudu);
            return;
          }

          editingItem.dueDate = undefined;
          editingItem.scheduledOrder = undefined;
        }

        updateTuduFn(editingItem);
      },
      [updateTuduFn],
    );

    const handleSendToOrRemoveFromToday = useCallback(
      (editingItem: TuduViewModel, swipeableRef: React.RefObject<SwipeableCardRef>) => {
        if (editingItem.dueDate && isToday(editingItem.dueDate)) {
          setTimeout(() => {
            removeFromToday(editingItem);
            swipeableRef.current?.closeOptions();
          }, 700);
        } else {
          if (editingItem.recurrence) {
            setTuduWaitingForConfirmation(editingItem);
            return;
          }
          setTimeout(() => {
            sendToToday(editingItem);
            swipeableRef.current?.closeOptions();
          }, 700);
        }
      },
      [removeFromToday, sendToToday],
    );

    const handleSchedule = useCallback(
      (editingItem: TuduViewModel) => {
        onSchedulePress(editingItem);
      },
      [onSchedulePress],
    );

    const handleModalClose = useCallback(() => {
      setTuduWaitingForConfirmation(null);
      closeCurrentlyOpenSwipeable();
    }, [closeCurrentlyOpenSwipeable]);

    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<TuduViewModel>) => (
        <TuduListRowItem
          tudu={item}
          isActive={false}
          isDraggable={false}
          onTuduPress={handleTuduPress}
          onStarPress={handleStarPress}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSchedule={handleSchedule}
          onSendToOrRemoveFromToday={handleSendToOrRemoveFromToday}
          additionalInfo={getAdditionalInformation(item)}
        />
      ),
      [
        getAdditionalInformation,
        handleDelete,
        handleEdit,
        handleSchedule,
        handleSendToOrRemoveFromToday,
        handleStarPress,
        handleTuduPress,
      ],
    );

    const keyExtractor = useCallback((item: TuduViewModel) => item.id, []);

    return (
      <>
        {virtualized ? (
          <FlatList
            data={tudus}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            style={[styles.list, style]}
            contentContainerStyle={contentContainerStyle}
            removeClippedSubviews={false}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={11}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            ListEmptyComponent={ListEmptyComponent}
          />
        ) : (
          <View style={style}>
            {tudus.map(tudu => (
              <TuduListRowItem
                key={tudu.id}
                tudu={tudu}
                isActive={false}
                isDraggable={false}
                onTuduPress={handleTuduPress}
                onStarPress={handleStarPress}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSchedule={handleSchedule}
                onSendToOrRemoveFromToday={handleSendToOrRemoveFromToday}
                additionalInfo={getAdditionalInformation(tudu)}
              />
            ))}
          </View>
        )}
        <SendToTodayModal
          tudu={tuduWaitingForConfirmation}
          onUpdateTudu={updateTuduFn}
          onClose={handleModalClose}
        />
      </>
    );
  },
);

export { SimpleTuduList };
