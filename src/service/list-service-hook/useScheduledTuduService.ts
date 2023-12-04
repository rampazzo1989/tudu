import {useCallback} from 'react';
import {useRecoilState} from 'recoil';
import {
  myLists,
  tudus as tudusState,
  UNLISTED,
  unlistedTudus as unlistedTudusState,
} from '../../scenes/home/state';
import {TuduViewModel} from '../../scenes/home/types';
import {getDateOnlyTimeStamp} from '../../utils/date-utils';
import {useListService} from './useListService';

const useScheduledTuduService = () => {
  const [customLists] = useRecoilState(myLists);
  const [customTudus] = useRecoilState(tudusState);
  const [unlistedTudus] = useRecoilState(unlistedTudusState);
  const {saveTudu, saveAllTudus} = useListService();

  const getTudusForDate = useCallback(
    (date: Date) => {
      const dateOnlyTimeStamp = getDateOnlyTimeStamp(date);

      const tudusFromDate: Array<TuduViewModel> = [];

      customTudus.forEach((tuduMap, listId) => {
        const filteredTudus = [...tuduMap].filter(([_, tudu]) => {
          const itsFromDate =
            tudu.dueDate &&
            getDateOnlyTimeStamp(tudu.dueDate) === dateOnlyTimeStamp;
          return itsFromDate;
        });

        const listName = customLists.get(listId)?.label;

        filteredTudus.forEach(([_, tudu]) =>
          tudusFromDate.push(
            new TuduViewModel(tudu, listId, 'default', listName),
          ),
        );
      });

      const filteredTudus = [...unlistedTudus].filter(([_, tudu]) => {
        const itsFromDate =
          tudu.dueDate &&
          getDateOnlyTimeStamp(tudu.dueDate) === dateOnlyTimeStamp;
        return itsFromDate;
      });

      filteredTudus.forEach(([_, tudu]) =>
        tudusFromDate.push(
          new TuduViewModel(tudu, UNLISTED, 'default', 'Unlisted'),
        ),
      );

      tudusFromDate.sort(
        (a, b) => (a.scheduledOrder ?? -1) - (b.scheduledOrder ?? -1),
      );

      return tudusFromDate;
    },
    [customLists, customTudus, unlistedTudus],
  );

  const scheduleTudu = useCallback(
    (tudu: TuduViewModel, date: Date) => {
      tudu.dueDate = date;

      saveTudu(tudu);
    },
    [saveTudu],
  );

  const unscheduleTudu = useCallback(
    (tudu: TuduViewModel) => {
      tudu.dueDate = undefined;

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

  return {getTudusForDate, scheduleTudu, unscheduleTudu, saveAllScheduledTudus};
};

export {useScheduledTuduService};
