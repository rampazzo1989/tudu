import {useCallback} from 'react';
import {useRecoilState} from 'recoil';
import {
  myLists,
  tudus as tudusState,
  UNLISTED_LIST_ID,
  unlistedTudus as unlistedTudusState,
} from '../../scenes/home/state';
import {TuduViewModel} from '../../scenes/home/types';
import {getDateOnlyTimeStamp, isFutureDate} from '../../utils/date-utils';
import {useListService} from './useListService';

const useScheduledTuduService = () => {
  const [customLists] = useRecoilState(myLists);
  const [customTudus] = useRecoilState(tudusState);
  const [unlistedTudus] = useRecoilState(unlistedTudusState);
  const {saveTudu, saveAllTudus} = useListService();

  const getTudusForDate = useCallback(
    (date: Date, showOutdated: boolean = false) => {
      const dateOnlyTimeStamp = getDateOnlyTimeStamp(date);

      const tudusFromDate: Array<TuduViewModel> = [];

      customTudus.forEach((tuduMap, listId) => {
        const filteredTudus = [...tuduMap].filter(([_, tudu]) => {
          const itsFromDate =
            tudu.dueDate &&
            getDateOnlyTimeStamp(tudu.dueDate) === dateOnlyTimeStamp;
          const isOutdated = showOutdated 
            && tudu.dueDate && !tudu.done && getDateOnlyTimeStamp(tudu.dueDate) < dateOnlyTimeStamp;
          return itsFromDate || isOutdated;
        });

        const listName = customLists.get(listId)?.label;

        filteredTudus.forEach(([_, tudu]) =>
          tudusFromDate.push(
            new TuduViewModel(tudu, listId, 'default', listName),
          ),
        );
      });

      const filteredUnlistedTudus = [...unlistedTudus].filter(([_, tudu]) => {
        const itsFromDate =
          tudu.dueDate &&
          getDateOnlyTimeStamp(tudu.dueDate) === dateOnlyTimeStamp;
          const isOutdated = showOutdated 
            && tudu.dueDate && !tudu.done && getDateOnlyTimeStamp(tudu.dueDate) < dateOnlyTimeStamp;
          return itsFromDate || isOutdated;
      });

      filteredUnlistedTudus.forEach(([_, tudu]) =>
        tudusFromDate.push(
          new TuduViewModel(tudu, UNLISTED_LIST_ID, 'unlisted', 'Unlisted'),
        ),
      );

      tudusFromDate.sort((a, b) => {
        const dateComparison = ((a.dueDate && getDateOnlyTimeStamp(a.dueDate)) || 0) - ((b.dueDate && getDateOnlyTimeStamp(b.dueDate)) || 0);
        if (dateComparison !== 0) {
          return dateComparison;
        }

        // If on the same date: items with specific time come first, ordered by time
        if (a.hasTime && b.hasTime) {
          const timeA = a.dueDate ? a.dueDate.getTime() : 0;
          const timeB = b.dueDate ? b.dueDate.getTime() : 0;
          if (timeA !== timeB) return timeA - timeB;
        } else if (a.hasTime && !b.hasTime) {
          return -1;
        } else if (!a.hasTime && b.hasTime) {
          return 1;
        }

        return (a.scheduledOrder || 0) - (b.scheduledOrder || 0);
      });

      return tudusFromDate;
    },
    [customLists, customTudus, unlistedTudus],
  );

  const getAllUpcomingTudus = useCallback(
    (baseDate: Date = new Date()) => {
      const upcomingTudus: Array<TuduViewModel> = [];

      customTudus.forEach((tuduMap, listId) => {
        const filteredTudus = [...tuduMap].filter(([_, tudu]) => {
          return (
            tudu.dueDate &&
            !tudu.done &&
            isFutureDate(tudu.dueDate, baseDate)
          );
        });

        const listName = customLists.get(listId)?.label;

        filteredTudus.forEach(([_, tudu]) =>
          upcomingTudus.push(
            new TuduViewModel(tudu, listId, 'default', listName),
          ),
        );
      });

      const filteredUnlistedTudus = [...unlistedTudus].filter(([_, tudu]) => {
        return (
          tudu.dueDate &&
          !tudu.done &&
          isFutureDate(tudu.dueDate, baseDate)
        );
      });

      filteredUnlistedTudus.forEach(([_, tudu]) =>
        upcomingTudus.push(
          new TuduViewModel(tudu, UNLISTED_LIST_ID, 'unlisted', 'Unlisted'),
        ),
      );

      upcomingTudus.sort((a, b) => {
        const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;

        const dateA = a.dueDate ? getDateOnlyTimeStamp(a.dueDate) : 0;
        const dateB = b.dueDate ? getDateOnlyTimeStamp(b.dueDate) : 0;

        if (dateA !== dateB) {
          return dateA - dateB;
        }

        if (a.hasTime && b.hasTime) {
          if (timeA !== timeB) return timeA - timeB;
        } else if (a.hasTime && !b.hasTime) {
          return -1;
        } else if (!a.hasTime && b.hasTime) {
          return 1;
        }

        return (a.scheduledOrder || 0) - (b.scheduledOrder || 0);
      });

      return upcomingTudus;
    },
    [customLists, customTudus, unlistedTudus],
  );

  const scheduleTudu = useCallback(
    (tudu: TuduViewModel, date: Date, hasTime?: boolean) => {
      tudu.dueDate = date;
      tudu.hasTime = hasTime;

      saveTudu(tudu);
    },
    [saveTudu],
  );

  const unscheduleTudu = useCallback(
    (tudu: TuduViewModel) => {
      tudu.dueDate = undefined;
      tudu.hasTime = undefined;

      saveTudu(tudu);
    },
    [saveTudu],
  );

  const saveAllScheduledTudus = useCallback(
    (tudus: TuduViewModel[]) => {
      tudus.forEach((tudu, index) => {
        if (!tudu.dueDate) {
          return;
        }
        tudu.scheduledOrder = index;
      });

      saveAllTudus(tudus);
    },
    [saveAllTudus],
  );

  return {
    getTudusForDate,
    getAllUpcomingTudus,
    scheduleTudu,
    unscheduleTudu,
    saveAllScheduledTudus,
  };
};

export {useScheduledTuduService};

