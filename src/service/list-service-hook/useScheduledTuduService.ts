import {useCallback} from 'react';
import {useRecoilState} from 'recoil';
import {myLists} from '../../scenes/home/state';
import {TuduViewModel} from '../../scenes/home/types';
import {getDateOnlyTimeStamp} from '../../utils/date-utils';
import {useListService} from './useListService';

const useScheduledTuduService = () => {
  const [customLists, setCustomLists] = useRecoilState(myLists);
  const {saveTudu} = useListService();

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

      return tudusFromDate;
    },
    [customLists],
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

  return {getTudusForDate, scheduleTudu, unscheduleTudu};
};

export {useScheduledTuduService};