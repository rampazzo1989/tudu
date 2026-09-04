import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NewTuduModal } from '../../components/new-tudu-modal';
import { Page } from '../../components/page';
import { PageContent } from '../../components/page-content';
import { SimpleTuduList } from '../../components/simple-tudu-list';
import { SkeletonTuduList } from '../../components/skeleton-tudu-list';
import { TuduAdditionalInformation } from '../../components/tudu-card/types';
import { useCloseCurrentlyOpenSwipeable } from '../../hooks/useCloseAllSwipeables';
import { useListService } from '../../service/list-service-hook/useListService';
import { useSearchService } from '../../service/list-service-hook/useSearchService';
import { formatScheduledDateTime, formatToLocaleTime, isToday } from '../../utils/date-utils';
import { UNLISTED_LIST_ID } from '../home/state';
import { ListViewModel, TuduViewModel, RecurrenceType } from '../home/types';
import { SearchHeader } from './components/search-header';
import { PaddedContainer, styles } from './styles';
import { SearchPageProps } from './types';
import { ScheduleModal } from '../../components/schedule-modal';
import { openGoogleCalendarEvent } from '../../utils/google-calendar-utils';

const SearchPage: React.FC<SearchPageProps> = ({ navigation, route: _route }) => {
  const { t } = useTranslation();
  const [tudus, setTudus] = useState<TuduViewModel[]>();

  const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
  const [editingTudu, setEditingTudu] = useState<TuduViewModel>();
  const [searchText, setSearchText] = useState('');
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  const { saveTudu, deleteTudu, restoreBackup } = useListService();

  const { searchTudus } = useSearchService();

  const { closeCurrentlyOpenSwipeable } = useCloseCurrentlyOpenSwipeable();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    const searchedTudus = searchTudus(searchText);
    setTudus(searchedTudus ?? []);
  }, [searchText, searchTudus, setTudus]);

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

  const virtualList: ListViewModel = useMemo(() => {
    const list = new ListViewModel({
      id: 'search',
      label: t('listTitles.search'),
    });
    return list;
  }, [t]);

  const handleTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const handleTuduSchedulePress = useCallback((tudu: TuduViewModel) => {
    setEditingTudu(tudu);
    setScheduleModalVisible(true);
  }, []);

  const handleSchedule = useCallback(
    (
      date: Date,
      hasTime?: boolean,
      recurrence?: RecurrenceType,
      addToGoogleCalendar?: boolean,
    ) => {
      if (editingTudu) {
        editingTudu.dueDate = date;
        editingTudu.hasTime = hasTime;
        editingTudu.recurrence = recurrence;
        saveTudu(editingTudu);

        if (addToGoogleCalendar && date) {
          openGoogleCalendarEvent({
            title: editingTudu.label,
            date,
            hasTime,
            recurrence,
            listName: editingTudu.listName,
          });
        }
      }
    },
    [editingTudu, saveTudu],
  );

  return (
    <Page>
      <SearchHeader
        listData={virtualList}
        onBackButtonPress={handleBackButtonPress}
        onTextChange={handleTextChange}
      />
      <PageContent contentContainerStyle={styles.pageContent}>
        {!tudus ? (
          <SkeletonTuduList />
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
        tuduTitle={editingTudu?.label}
        listName={editingTudu?.listName}
      />
    </Page>
  );
};

export { SearchPage };
