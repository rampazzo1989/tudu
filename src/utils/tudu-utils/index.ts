import { TuduViewModel } from '../../scenes/home/types';
import { getDateOnlyTimeStamp } from '../date-utils';

export const updateRecurrenceFromDate = (tudu: TuduViewModel, baseDate: Date): TuduViewModel => {
  if (!tudu.dueDate || !tudu.recurrence) return tudu;

  let nextDueDate = new Date(tudu.dueDate);

  // Update the next due date based on the recurrence type
  // and the current date
  while (getDateOnlyTimeStamp(nextDueDate) < getDateOnlyTimeStamp(baseDate)) {
  switch (tudu.recurrence) {
      case 'daily':
        nextDueDate.setDate(baseDate.getDate());
        break;
      case 'weekly':
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
      case 'monthly':
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        break;
      default:
        break;
    }
  }

  const updatedTudu = tudu.clone();
  updatedTudu.dueDate = nextDueDate;
  return updatedTudu;
}

export const updateRecurrentTudu = (tudu: TuduViewModel): TuduViewModel => {
  if (!tudu.dueDate || !tudu.recurrence) return tudu;

  const today = new Date();

  const updatedTudu = updateRecurrenceFromDate(tudu, today);

  if (!updatedTudu.dueDate) return tudu;

  const wasOutdated= getDateOnlyTimeStamp(tudu.dueDate) < getDateOnlyTimeStamp(today);
  const wasDone = updatedTudu.done;

  if (wasOutdated && wasDone) {
    updatedTudu.done = false;
  }

  return updatedTudu;
}
