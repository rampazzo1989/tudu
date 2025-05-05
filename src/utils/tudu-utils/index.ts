import { TuduViewModel } from '../../scenes/home/types';
import { getDateOnlyTimeStamp } from '../date-utils';

export const updateRecurrentTudu = (tudu: TuduViewModel): TuduViewModel => {
  if (!tudu.dueDate || !tudu.recurrence) return tudu;

  let nextDueDate = new Date(tudu.dueDate);

  const today = new Date();

  // Atualiza a data de vencimento para a próxima recorrência
  while (getDateOnlyTimeStamp(nextDueDate) < getDateOnlyTimeStamp(today)) {
    switch (tudu.recurrence) {
      case 'daily':
        nextDueDate.setDate(today.getDate());
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

  const isOutdated = getDateOnlyTimeStamp(tudu.dueDate) < getDateOnlyTimeStamp(today);
  const wasDone = tudu.done;

  if (isOutdated && wasDone) {
    tudu.done = false;
    tudu.dueDate = nextDueDate;
  }

  return tudu;
};