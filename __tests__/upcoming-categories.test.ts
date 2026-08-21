import {
  isFutureDate,
  getUpcomingCategoryInfo,
  groupTudusByUpcomingPeriod,
} from '../src/utils/date-utils';

describe('Upcoming Categories & Grouping feature', () => {
  const mockT = (key: string) => {
    switch (key) {
      case 'upcomingSections.tomorrow':
        return 'Amanhã';
      case 'upcomingSections.thisWeek':
        return 'Esta semana';
      case 'upcomingSections.nextWeek':
        return 'Próxima semana';
      case 'upcomingSections.thisMonth':
        return 'Este mês';
      case 'upcomingSections.thisYear':
        return 'Este ano';
      default:
        return key;
    }
  };

  describe('isFutureDate', () => {
    it('should return true for dates from tomorrow onwards', () => {
      const baseDate = new Date(2026, 7, 21); // Friday, Aug 21, 2026
      const tomorrow = new Date(2026, 7, 22);
      const nextMonth = new Date(2026, 8, 15);

      expect(isFutureDate(tomorrow, baseDate)).toBe(true);
      expect(isFutureDate(nextMonth, baseDate)).toBe(true);
    });

    it('should return false for today or past dates', () => {
      const baseDate = new Date(2026, 7, 21); // Friday, Aug 21, 2026
      const todaySameDateDifferentTime = new Date(2026, 7, 21, 15, 30);
      const yesterday = new Date(2026, 7, 20);

      expect(isFutureDate(todaySameDateDifferentTime, baseDate)).toBe(false);
      expect(isFutureDate(yesterday, baseDate)).toBe(false);
    });
  });

  describe('getUpcomingCategoryInfo', () => {
    // Base date: Friday, August 21, 2026
    // Tomorrow: Saturday, August 22, 2026
    // End of current week: Sunday, August 23, 2026
    // Next week: Monday, Aug 24 to Sunday, Aug 30, 2026
    // End of current month: Monday, Aug 31, 2026
    // End of current year: Dec 31, 2026
    const baseDate = new Date(2026, 7, 21, 10, 0, 0);

    it('should classify tomorrow as "tomorrow"', () => {
      const date = new Date(2026, 7, 22, 14, 0); // Saturday
      const info = getUpcomingCategoryInfo(date, baseDate, mockT);
      expect(info.key).toBe('tomorrow');
      expect(info.title).toBe('Amanhã');
    });

    it('should classify Sunday of current week as "thisWeek"', () => {
      const date = new Date(2026, 7, 23, 18, 0); // Sunday
      const info = getUpcomingCategoryInfo(date, baseDate, mockT);
      expect(info.key).toBe('thisWeek');
      expect(info.title).toBe('Esta semana');
    });

    it('should classify next week days as "nextWeek"', () => {
      const mondayNextWeek = new Date(2026, 7, 24);
      const sundayNextWeek = new Date(2026, 7, 30);

      const infoMon = getUpcomingCategoryInfo(mondayNextWeek, baseDate, mockT);
      expect(infoMon.key).toBe('nextWeek');
      expect(infoMon.title).toBe('Próxima semana');

      const infoSun = getUpcomingCategoryInfo(sundayNextWeek, baseDate, mockT);
      expect(infoSun.key).toBe('nextWeek');
      expect(infoSun.title).toBe('Próxima semana');
    });

    it('should classify remaining days of current month after next week as "thisMonth"', () => {
      const endOfMonth = new Date(2026, 7, 31); // Monday, Aug 31
      const info = getUpcomingCategoryInfo(endOfMonth, baseDate, mockT);
      expect(info.key).toBe('thisMonth');
      expect(info.title).toBe('Este mês');
    });

    it('should classify dates in subsequent months of current year as "thisYear"', () => {
      const sepDate = new Date(2026, 8, 15);
      const decDate = new Date(2026, 11, 25);

      const infoSep = getUpcomingCategoryInfo(sepDate, baseDate, mockT);
      expect(infoSep.key).toBe('thisYear');
      expect(infoSep.title).toBe('Este ano');

      const infoDec = getUpcomingCategoryInfo(decDate, baseDate, mockT);
      expect(infoDec.key).toBe('thisYear');
      expect(infoDec.title).toBe('Este ano');
    });

    it('should classify dates in future years by year number', () => {
      const date2027 = new Date(2027, 2, 10);
      const date2028 = new Date(2028, 5, 20);

      const info2027 = getUpcomingCategoryInfo(date2027, baseDate, mockT);
      expect(info2027.key).toBe('year-2027');
      expect(info2027.title).toBe('2027');

      const info2028 = getUpcomingCategoryInfo(date2028, baseDate, mockT);
      expect(info2028.key).toBe('year-2028');
      expect(info2028.title).toBe('2028');
    });
  });

  describe('groupTudusByUpcomingPeriod', () => {
    const baseDate = new Date(2026, 7, 21, 10, 0, 0); // Friday, Aug 21, 2026

    it('should correctly group and order tudus across categories', () => {
      const sampleTudus = [
        {
          id: '1',
          label: 'Task for 2027',
          dueDate: new Date(2027, 0, 15),
        },
        {
          id: '2',
          label: 'Task for Tomorrow with time',
          dueDate: new Date(2026, 7, 22, 9, 0),
          hasTime: true,
        },
        {
          id: '3',
          label: 'Task for Tomorrow untimed',
          dueDate: new Date(2026, 7, 22),
          hasTime: false,
        },
        {
          id: '4',
          label: 'Task for this Sunday',
          dueDate: new Date(2026, 7, 23),
        },
        {
          id: '5',
          label: 'Task for next Wednesday',
          dueDate: new Date(2026, 7, 26),
        },
        {
          id: '6',
          label: 'Task for this November',
          dueDate: new Date(2026, 10, 10),
        },
        {
          id: '7',
          label: 'Task for 2028',
          dueDate: new Date(2028, 6, 1),
        },
      ];

      const sections = groupTudusByUpcomingPeriod(sampleTudus, mockT, baseDate);

      expect(sections.length).toBe(6);
      expect(sections[0].key).toBe('tomorrow');
      expect(sections[0].title).toBe('Amanhã');
      expect(sections[0].tudus.length).toBe(2);
      // Timed task should be first
      expect(sections[0].tudus[0].id).toBe('2');
      expect(sections[0].tudus[1].id).toBe('3');

      expect(sections[1].key).toBe('thisWeek');
      expect(sections[1].title).toBe('Esta semana');
      expect(sections[1].tudus.length).toBe(1);
      expect(sections[1].tudus[0].id).toBe('4');

      expect(sections[2].key).toBe('nextWeek');
      expect(sections[2].title).toBe('Próxima semana');
      expect(sections[2].tudus.length).toBe(1);
      expect(sections[2].tudus[0].id).toBe('5');

      expect(sections[3].key).toBe('thisYear');
      expect(sections[3].title).toBe('Este ano');
      expect(sections[3].tudus.length).toBe(1);
      expect(sections[3].tudus[0].id).toBe('6');

      expect(sections[4].key).toBe('year-2027');
      expect(sections[4].title).toBe('2027');
      expect(sections[4].tudus.length).toBe(1);
      expect(sections[4].tudus[0].id).toBe('1');

      expect(sections[5].key).toBe('year-2028');
      expect(sections[5].title).toBe('2028');
      expect(sections[5].tudus.length).toBe(1);
      expect(sections[5].tudus[0].id).toBe('7');
    });

    it('should omit empty sections when there are no tudus in those periods', () => {
      const onlyTomorrowAnd2027 = [
        {
          id: '1',
          label: 'Tomorrow',
          dueDate: new Date(2026, 7, 22),
        },
        {
          id: '2',
          label: 'In 2027',
          dueDate: new Date(2027, 4, 1),
        },
      ];

      const sections = groupTudusByUpcomingPeriod(
        onlyTomorrowAnd2027,
        mockT,
        baseDate,
      );

      expect(sections.length).toBe(2);
      expect(sections.map(s => s.key)).toEqual(['tomorrow', 'year-2027']);
    });
  });
});
