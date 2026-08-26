import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon } from '../../components/animated-icons/calendar';
import { ListHeader } from '../../components/list-header';
import { NewTuduModal } from '../../components/new-tudu-modal';
import { Page } from '../../components/page';
import { PageContent } from '../../components/page-content';
import { ScheduleModal } from '../../components/schedule-modal';
import { SimpleTuduList } from '../../components/simple-tudu-list';
import { SkeletonTuduList } from '../../components/skeleton-tudu-list';
import { TuduAdditionalInformation } from '../../components/tudu-card/types';
import { useCloseCurrentlyOpenSwipeable } from '../../hooks/useCloseAllSwipeables';
import { useListService } from '../../service/list-service-hook/useListService';
import { useScheduledTuduService } from '../../service/list-service-hook/useScheduledTuduService';
import {
  formatScheduledDateTime,
  groupTudusByUpcomingPeriod,
  isToday,
} from '../../utils/date-utils';
import { UNLISTED_LIST_ID } from '../home/state';
import { ListViewModel, RecurrenceType, TuduViewModel } from '../home/types';
import { openGoogleCalendarEvent } from '../../utils/google-calendar-utils';
import {
  EmptyStateContainer,
  EmptyStateText,
  PaddedContainer,
  UpcomingSectionTitle,
  styles,
} from './styles';
import { UpcomingTudusPageProps } from './types';

const UpcomingTudusPage: React.FC<UpcomingTudusPageProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const [tudus, setTudus] = useState<TuduViewModel[]>();

  const [newTuduPopupVisible, setNewTuduPopupVisible] = useState(false);
  const [editingTudu, setEditingTudu] = useState<TuduViewModel>();
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  const { saveTudu, deleteTudu, restoreBackup } = useListService();
  const { getAllUpcomingTudus } = useScheduledTuduService();

  const { closeCurrentlyOpenSwipeable } = useCloseCurrentlyOpenSwipeable();

  const handleBackButtonPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    setTimeout(() => {
      const upcoming = getAllUpcomingTudus();
      setTudus(upcoming ?? []);
    }, 100);
  }, [getAllUpcomingTudus, setTudus]);

  const getAdditionalInformation = useCallback(
    (tudu: TuduViewModel): TuduAdditionalInformation | undefined => {
      if (tudu.listName && tudu.listId !== UNLISTED_LIST_ID) {
        if (tudu.dueDate) {
          return {
            label: `${tudu.listName} • ${formatScheduledDateTime(
              tudu.dueDate,
              tudu.hasTime,
              t,
            )}`,
            originType: 'list',
          };
        }
        return {
          label: tudu.listName,
          originType: 'list',
        };
      }
      if (tudu.dueDate) {
        return {
          label: formatScheduledDateTime(tudu.dueDate, tudu.hasTime, t),
          originType: isToday(tudu.dueDate) ? 'today' : 'scheduled',
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

  const virtualList: ListViewModel = useMemo(() => {
    return new ListViewModel({
      id: 'upcoming-tudus',
      label: t('listTitles.upcomingPageTitle'),
    });
  }, [t]);

  const sections = useMemo(() => {
    if (!tudus) {
      return [];
    }
    return groupTudusByUpcomingPeriod(tudus, t);
  }, [tudus, t]);

  return (
    <Page>
      <ListHeader
        listData={virtualList}
        onBackButtonPress={handleBackButtonPress}
        Icon={CalendarIcon}
      />
      <PageContent contentContainerStyle={styles.pageContent}>
        {!tudus ? (
          <SkeletonTuduList numberOfItems={route.params?.numberOfUndoneTudus} />
        ) : sections.length === 0 ? (
          <EmptyStateContainer>
            <EmptyStateText>{t('upcomingSections.empty')}</EmptyStateText>
          </EmptyStateContainer>
        ) : (
          <PaddedContainer>
            {sections.map((section, index) => (
              <React.Fragment key={section.key}>
                <UpcomingSectionTitle
                  title={section.title}
                  isFirst={index === 0}
                />
                <SimpleTuduList
                  getAdditionalInformation={getAdditionalInformation}
                  tudus={section.tudus}
                  updateTuduFn={saveTudu}
                  deleteTuduFn={deleteTudu}
                  undoDeletionFn={restoreBackup}
                  onEditPress={handleEditPress}
                  onSchedulePress={handleTuduSchedulePress}
                />
              </React.Fragment>
            ))}
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

export { UpcomingTudusPage };
