import {useCallback} from 'react';
import {useRecoilState} from 'recoil';
import {myLists, unlistedTudusList} from '../../scenes/home/state';
import {TuduViewModel} from '../../scenes/home/types';
import {getDateOnlyTimeStamp} from '../../utils/date-utils';
import {useListService} from './useListService';

const useScheduledTuduService = () => {
  const [customLists] = useRecoilState(myLists);
  const [unlistedTudus] = useRecoilState(unlistedTudusList);
  const {saveTudu, saveAllTudus} = useListService();

  const getTudusForDate = useCallback(
    (date: Date) => {
      const dateOnlyTimeStamp = getDateOnlyTimeStamp(date);

      const tudusFromDate: Array<TuduViewModel> = [];

      customLists.forEach(list => {
        const filteredTudus = [...list.tudus].filter(([_, tudu]) => {
          const itsFromDate =
            tudu.dueDate &&
            getDateOnlyTimeStamp(tudu.dueDate) === dateOnlyTimeStamp;
          return itsFromDate;
        });

        filteredTudus.forEach(([_, tudu]) =>
          tudusFromDate.push(
            new TuduViewModel(tudu, list.id, 'default', list.label),
          ),
        );
      });

      const filteredTudus = [...unlistedTudus.tudus].filter(([_, tudu]) => {
        const itsFromDate =
          tudu.dueDate &&
          getDateOnlyTimeStamp(tudu.dueDate) === dateOnlyTimeStamp;
        return itsFromDate;
      });

      filteredTudus.forEach(([_, tudu]) =>
        tudusFromDate.push(
          new TuduViewModel(
            tudu,
            unlistedTudus.id,
            'default',
            unlistedTudus.label,
          ),
        ),
      );

      tudusFromDate.sort(
        (a, b) => (a.scheduledOrder ?? -1) - (b.scheduledOrder ?? -1),
      );

      return tudusFromDate;
    },
    [customLists, unlistedTudus],
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
