import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StarIcon } from '../../components/animated-icons/star-icon';
import { ListHeader } from '../../components/list-header';
import { NewTuduModal } from '../../components/new-tudu-modal';
import { Page } from '../../components/page';
import { PageContent } from '../../components/page-content';
import { SimpleTuduList } from '../../components/simple-tudu-list';
import { SkeletonTuduList } from '../../components/skeleton-tudu-list';
import { TuduAdditionalInformation } from '../../components/tudu-card/types';
import { useCloseCurrentlyOpenSwipeable } from '../../hooks/useCloseAllSwipeables';
import { useListService } from '../../service/list-service-hook/useListService';
import {
  formatToLocaleDate,
  formatToLocaleTime,
  formatScheduledDateTime,
  isToday,
} from '../../utils/date-utils';
import { UNLISTED_LIST_ID } from '../home/state';
import { ListViewModel, TuduViewModel, RecurrenceType } from '../home/types';
import { PaddedContainer, styles } from './styles';
import { StarredTudusPageProps } from './types';
import { ScheduleModal } from '../../components/schedule-modal';

const StarredTudusPage: React.FC<StarredTudusPageProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const [tudus, setTudus] = useState<TuduViewModel[]>();

  const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
  const [editingTudu, setEditingTudu] = useState<TuduViewModel>();
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  const { getAllStarredTudus, saveTudu, deleteTudu, restoreBackup } =
    useListService();

  const { closeCurrentlyOpenSwipeable } = useCloseCurrentlyOpenSwipeable();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    setTimeout(() => {
      const starredTudus = getAllStarredTudus();
      setTudus(starredTudus ?? []);
    }, 100);
  }, [getAllStarredTudus, setTudus]);

  const getAdditionalInformation = useCallback(
    (tudu: TuduViewModel): TuduAdditionalInformation | undefined => {
      if (tudu.listName && tudu.listId !== UNLISTED_LIST_ID) {
        if (tudu.hasTime && tudu.dueDate) {
          return {
            label: `${tudu.listName} • ${formatToLocaleTime(tudu.dueDate)}`,
            originType: 'list',
          };
        }
        return {
          label: tudu.listName,
          originType: 'list',
        };
      }
      if (tudu.dueDate) {
        const isScheduledForToday = isToday(tudu.dueDate);
        return {
          label: formatScheduledDateTime(tudu.dueDate, tudu.hasTime, t),
          originType: isScheduledForToday ? 'today' : 'scheduled',
        };
      }
    },
    [t],
  );

  const handleEditPress = useCallback((tudu: TuduViewModel) => {
    setEditingTudu(tudu);
    setNewTuduPopupVisible(true);
  }, []);

  const handleTuduSchedulePress = useCallback((tudu: TuduViewModel) => {
    setEditingTudu(tudu);
    setScheduleModalVisible(true);
  }, []);

  const handleSchedule = useCallback((date: Date, hasTime?: boolean, recurrence?: RecurrenceType) => {
    if (editingTudu) {
      editingTudu.dueDate = date;
      editingTudu.hasTime = hasTime;
      editingTudu.recurrence = recurrence;
      saveTudu(editingTudu);
    }
  }, [editingTudu, saveTudu]);

  const virtualList: ListViewModel = useMemo(() => {
    const list = new ListViewModel({
      id: 'starred-tudus',
      label: t('listTitles.starredPageTitle'),
    });
    return list;
  }, [t]);

  return (
    <Page>
      <ListHeader
        listData={virtualList}
        onBackButtonPress={handleBackButtonPress}
        Icon={StarIcon}
      />
      <PageContent contentContainerStyle={styles.pageContent}>
        {!tudus ? (
          <SkeletonTuduList numberOfItems={route.params?.numberOfUndoneTudus} />
        ) : (
          <PaddedContainer>
            <SimpleTuduList
              getAdditionalInformation={getAdditionalInformation}
              tudus={tudus}
              updateTuduFn={saveTudu}
              deleteTuduFn={deleteTudu}
              undoDeletionFn={restoreBackup}
              onEditPress={handleEditPress}
              onSchedulePress={handleTuduSchedulePress}
            />
          </PaddedContainer>
        )}
      </PageContent>

      <NewTuduModal
        visible={newTuduPopupVisible}
        onRequestClose={() => {
          setNewTuduPopupVisible(false);
          setEditingTudu(undefined);
          closeCurrentlyOpenSwipeable();
        }}
        editingTudu={editingTudu}
        onInsertOrUpdate={saveTudu}
      />
      <ScheduleModal
        isVisible={scheduleModalVisible}
        onModalClose={() => {
          setScheduleModalVisible(false);
          setEditingTudu(undefined);
          setTimeout(closeCurrentlyOpenSwipeable, 500);
        }}
        onSchedule={handleSchedule}
        currentDate={editingTudu?.dueDate}
        hasTimeInitial={editingTudu?.hasTime}
        currentRecurrence={editingTudu?.recurrence}
      />
    </Page>
  );
};

export { StarredTudusPage };
