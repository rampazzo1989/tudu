import { TuduViewModel, TuduItem, RecurrenceType } from '../src/scenes/home/types';
import { updateRecurrenceFromDate, updateRecurrentTudu } from '../src/utils/tudu-utils';
import { getDateOnlyTimeStamp, isOutdated, isToday } from '../src/utils/date-utils';
import { PARAMETERS_REGEX, DATE_PARAMETERS_REGEX, TIME_PARAMETERS_REGEX } from '../src/constants';

describe('Recurrence Feature Tests', () => {
  describe('TuduViewModel Recurrence Property', () => {
    it('should initialize, clone, and mapBack with recurrence properly', () => {
      const item: TuduItem = {
        id: 'rec-1',
        label: 'Tomar remédio',
        done: false,
        dueDate: new Date(2026, 7, 21, 8, 0, 0),
        hasTime: true,
        recurrence: 'daily',
      };

      const viewModel = new TuduViewModel(item, 'list-1', 'default', 'Saúde');
      expect(viewModel.recurrence).toBe('daily');

      const cloned = viewModel.clone();
      expect(cloned.recurrence).toBe('daily');
      expect(cloned.id).toBe('rec-1');
      expect(cloned.dueDate?.getHours()).toBe(8);

      const mapped = cloned.mapBack();
      expect(mapped.recurrence).toBe('daily');
      expect(mapped.hasTime).toBe(true);
    });

    it('should allow clearing recurrence', () => {
      const viewModel = new TuduViewModel(
        {
          id: 'rec-2',
          label: 'Regar plantas',
          done: false,
          recurrence: 'weekly',
          dueDate: new Date(),
        },
        'list-1',
      );

      expect(viewModel.recurrence).toBe('weekly');
      viewModel.recurrence = undefined;
      expect(viewModel.recurrence).toBeUndefined();

      const cloned = viewModel.clone();
      expect(cloned.recurrence).toBeUndefined();
    });
  });

  describe('updateRecurrenceFromDate', () => {
    it('should correctly advance daily recurrence across days and month boundaries', () => {
      // 31 August 2026
      const tudu = new TuduViewModel(
        {
          id: 'test-daily',
          label: 'Academia',
          done: true,
          dueDate: new Date(2026, 7, 31, 10, 0, 0),
          recurrence: 'daily',
        },
        'list-1',
      );

      // Base date is 2 September 2026 (2 days later across month boundary)
      const baseDate = new Date(2026, 8, 2);
      const updated = updateRecurrenceFromDate(tudu, baseDate);

      expect(updated.dueDate).toBeDefined();
      expect(updated.dueDate?.getFullYear()).toBe(2026);
      expect(updated.dueDate?.getMonth()).toBe(8); // September
      expect(updated.dueDate?.getDate()).toBe(2);
      expect(updated.dueDate?.getHours()).toBe(10);
    });

    it('should correctly advance weekly recurrence', () => {
      // Monday 17 August 2026
      const tudu = new TuduViewModel(
        {
          id: 'test-weekly',
          label: 'Reunião semanal',
          done: true,
          dueDate: new Date(2026, 7, 17, 14, 0, 0),
          recurrence: 'weekly',
        },
        'list-1',
      );

      // Base date is 20 August 2026 (same week, next occurrence is 24 August)
      const baseDate = new Date(2026, 7, 20);
      const updated = updateRecurrenceFromDate(tudu, baseDate);

      expect(updated.dueDate).toBeDefined();
      expect(updated.dueDate?.getFullYear()).toBe(2026);
      expect(updated.dueDate?.getMonth()).toBe(7);
      expect(updated.dueDate?.getDate()).toBe(24);
    });

    it('should correctly advance monthly recurrence', () => {
      // 5 July 2026
      const tudu = new TuduViewModel(
        {
          id: 'test-monthly',
          label: 'Pagar conta',
          done: true,
          dueDate: new Date(2026, 6, 5, 9, 0, 0),
          recurrence: 'monthly',
        },
        'list-1',
      );

      // Base date is 21 August 2026 -> should advance to 5 September 2026
      const baseDate = new Date(2026, 7, 21);
      const updated = updateRecurrenceFromDate(tudu, baseDate);

      expect(updated.dueDate).toBeDefined();
      expect(updated.dueDate?.getFullYear()).toBe(2026);
      expect(updated.dueDate?.getMonth()).toBe(8); // September
      expect(updated.dueDate?.getDate()).toBe(5);
    });

    it('should correctly advance yearly recurrence', () => {
      // 10 August 2025
      const tudu = new TuduViewModel(
        {
          id: 'test-yearly',
          label: 'Aniversário',
          done: true,
          dueDate: new Date(2025, 7, 10),
          recurrence: 'yearly',
        },
        'list-1',
      );

      // Base date is 21 August 2026 -> should advance to 10 August 2027
      const baseDate = new Date(2026, 7, 21);
      const updated = updateRecurrenceFromDate(tudu, baseDate);

      expect(updated.dueDate).toBeDefined();
      expect(updated.dueDate?.getFullYear()).toBe(2027);
      expect(updated.dueDate?.getMonth()).toBe(7);
      expect(updated.dueDate?.getDate()).toBe(10);
    });

    it('should return untouched tudu if no recurrence or dueDate is set', () => {
      const tuduWithoutRecurrence = new TuduViewModel(
        {
          id: 'test-no-rec',
          label: 'Sem recorrência',
          done: false,
          dueDate: new Date(),
        },
        'list-1',
      );

      const result = updateRecurrenceFromDate(tuduWithoutRecurrence, new Date());
      expect(result).toBe(tuduWithoutRecurrence);
    });
  });

  describe('updateRecurrentTudu and completion status', () => {
    it('should reset done to false when outdated recurrent tudu is updated', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 2);

      const tudu = new TuduViewModel(
        {
          id: 'test-reset-done',
          label: 'Treino',
          done: true,
          dueDate: yesterday,
          recurrence: 'daily',
        },
        'list-1',
      );

      const updated = updateRecurrentTudu(tudu);
      expect(updated.done).toBe(false);
      expect(getDateOnlyTimeStamp(updated.dueDate!)).toBeGreaterThanOrEqual(
        getDateOnlyTimeStamp(new Date()),
      );
    });
  });

  describe('Recurrence Text Parameter Parsing', () => {
    it('should match recurrence flags in text input', () => {
      const testCases: Array<{ text: string; expected: RecurrenceType }> = [
        { text: 'Comprar remédio -d', expected: 'daily' },
        { text: 'Limpar casa --daily', expected: 'daily' },
        { text: 'Reunião semanal -w', expected: 'weekly' },
        { text: 'Revisão sprint --weekly', expected: 'weekly' },
        { text: 'Pagar aluguel -m', expected: 'monthly' },
        { text: 'Fechamento --monthly', expected: 'monthly' },
        { text: 'Imposto de renda -y', expected: 'yearly' },
        { text: 'Aniversário --yearly', expected: 'yearly' },
      ];

      testCases.forEach(({ text, expected }) => {
        let matched: RecurrenceType | undefined;
        let match;
        const regex = new RegExp(PARAMETERS_REGEX);
        while ((match = regex.exec(text)) !== null) {
          switch (match[1]?.toLowerCase()) {
            case '-d':
            case '--daily':
              matched = 'daily';
              break;
            case '-w':
            case '--weekly':
              matched = 'weekly';
              break;
            case '-m':
            case '--monthly':
              matched = 'monthly';
              break;
            case '-y':
            case '--yearly':
              matched = 'yearly';
              break;
          }
        }
        expect(matched).toBe(expected);
      });
    });
  });
});
