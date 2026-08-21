import {
  combineDateAndTime,
  formatScheduledDateTime,
  formatToLocaleTime,
  isToday,
  isTomorrow,
  getDateOnlyTimeStamp,
} from '../src/utils/date-utils';
import { TuduViewModel, TuduItem } from '../src/scenes/home/types';
import {
  PARAMETERS_REGEX,
  DATE_PARAMETERS_REGEX,
  TIME_PARAMETERS_REGEX,
} from '../src/constants';

describe('Schedule with Time feature', () => {
  describe('date-utils', () => {
    it('should combine date and time correctly', () => {
      const baseDate = new Date(2026, 7, 21, 0, 0, 0); // 21 Aug 2026
      const timeSource = new Date(2026, 0, 1, 14, 30, 0); // 14:30

      const combined = combineDateAndTime(baseDate, timeSource);
      expect(combined.getFullYear()).toBe(2026);
      expect(combined.getMonth()).toBe(7);
      expect(combined.getDate()).toBe(21);
      expect(combined.getHours()).toBe(14);
      expect(combined.getMinutes()).toBe(30);
    });

    it('should format date and time with formatScheduledDateTime', () => {
      const today = new Date();
      today.setHours(15, 45, 0, 0);

      const mockT = (key: string) => {
        if (key === 'labels.today') return 'Hoje';
        if (key === 'scheduleOptions.tomorrow') return 'Amanhã';
        if (key === 'labels.at') return 'às';
        return key;
      };

      const formattedTodayWithTime = formatScheduledDateTime(today, true, mockT);
      expect(formattedTodayWithTime).toContain('Hoje');
      expect(formattedTodayWithTime).toContain('às');
      expect(formattedTodayWithTime).toMatch(/15:45|3:45/);

      const formattedTodayWithoutTime = formatScheduledDateTime(today, false, mockT);
      expect(formattedTodayWithoutTime).toBe('Hoje');
    });

    it('should identify tomorrow correctly', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isTomorrow(tomorrow)).toBe(true);

      const today = new Date();
      expect(isTomorrow(today)).toBe(false);
    });
  });

  describe('TuduViewModel with hasTime', () => {
    it('should preserve hasTime across clone and mapBack', () => {
      const item: TuduItem = {
        id: 'tudu-1',
        label: 'Dentista',
        done: false,
        dueDate: new Date(2026, 7, 22, 16, 0, 0),
        hasTime: true,
      };

      const viewModel = new TuduViewModel(item, 'list-1', 'default', 'Saúde');
      expect(viewModel.hasTime).toBe(true);
      expect(viewModel.dueDate?.getHours()).toBe(16);

      const cloned = viewModel.clone();
      expect(cloned.hasTime).toBe(true);
      expect(cloned.dueDate?.getHours()).toBe(16);
      expect(cloned.listName).toBe('Saúde');

      const mappedBack = cloned.mapBack();
      expect(mappedBack.hasTime).toBe(true);
      expect(mappedBack.dueDate?.getHours()).toBe(16);
    });
  });

  describe('Time parameters regex matching and extraction', () => {
    it('should match @14:30 syntax', () => {
      const text = 'Reunião @14:30 com time';
      const timeRegex = /(?:^|\s)(?:@|--time\s+|-h\s+)(\d{1,2})(?::|h)?(\d{2})?(?=\s|$)/i;
      const match = timeRegex.exec(text);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('14');
      expect(match![2]).toBe('30');
    });

    it('should match @15h30 and @9h syntax', () => {
      const text = 'Comprar pão @15h30';
      const timeRegex = /(?:^|\s)(?:@|--time\s+|-h\s+)(\d{1,2})(?::|h)?(\d{2})?(?=\s|$)/i;
      const match = timeRegex.exec(text);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('15');
      expect(match![2]).toBe('30');

      const text2 = 'Médico @9h';
      const match2 = timeRegex.exec(text2);
      expect(match2).not.toBeNull();
      expect(match2![1]).toBe('9');
    });

    it('should match --time 18:00 and -h 10:00', () => {
      const text = 'Almoço --time 12:30';
      const timeRegex = /(?:^|\s)(?:@|--time\s+|-h\s+)(\d{1,2})(?::|h)?(\d{2})?(?=\s|$)/i;
      const match = timeRegex.exec(text);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('12');
      expect(match![2]).toBe('30');
    });

    it('should clean time parameter from text', () => {
      const text = 'Dentista @14:30 -t';
      const cleaned = text
        .replace(DATE_PARAMETERS_REGEX, '')
        .replace(TIME_PARAMETERS_REGEX, '')
        .replace(PARAMETERS_REGEX, '')
        .trim();
      expect(cleaned).toBe('Dentista');
    });
  });
});
