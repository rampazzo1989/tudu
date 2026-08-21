export const getDateOnlyTimeStamp = (date: Date) => {
  const castDate = typeof date === 'string' ? new Date(date) : date;
  return new Date(castDate.toDateString()).getTime();
};

export const isToday = (date: Date) =>
  getDateOnlyTimeStamp(date) === getDateOnlyTimeStamp(new Date());

export const isTomorrow = (date: Date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateOnlyTimeStamp(date) === getDateOnlyTimeStamp(tomorrow);
};

export const isOutdated = (date: Date) =>
  getDateOnlyTimeStamp(date) < getDateOnlyTimeStamp(new Date());

export const isFutureDate = (date: Date, baseDate: Date = new Date()) =>
  getDateOnlyTimeStamp(date) > getDateOnlyTimeStamp(baseDate);

export const formatToLocaleDate = (date: Date) => {
  const castDate = typeof date === 'string' ? new Date(date) : date;
  return castDate.toLocaleDateString();
};

export const formatToLocaleTime = (date: Date) => {
  const castDate = typeof date === 'string' ? new Date(date) : date;
  return castDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const combineDateAndTime = (date: Date, time: Date): Date => {
  const result = new Date(date);
  result.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return result;
};

export const formatScheduledDateTime = (
  date: Date,
  hasTime: boolean = false,
  t?: (key: string, options?: any) => string,
): string => {
  const castDate = typeof date === 'string' ? new Date(date) : date;
  const timeStr = hasTime ? formatToLocaleTime(castDate) : '';

  if (isToday(castDate)) {
    const todayLabel = t ? t('labels.today') : 'Hoje';
    if (hasTime) {
      const atLabel = t ? t('labels.at') : 'às';
      return `${todayLabel} ${atLabel} ${timeStr}`;
    }
    return todayLabel;
  }

  if (isTomorrow(castDate)) {
    const tomorrowLabel = t ? t('scheduleOptions.tomorrow') : 'Amanhã';
    if (hasTime) {
      const atLabel = t ? t('labels.at') : 'às';
      return `${tomorrowLabel} ${atLabel} ${timeStr}`;
    }
    return tomorrowLabel;
  }

  const dateStr = formatToLocaleDate(castDate);
  if (hasTime) {
    const atLabel = t ? t('labels.at') : 'às';
    return `${dateStr} ${atLabel} ${timeStr}`;
  }
  return dateStr;
};

export type UpcomingCategoryKey =
  | 'tomorrow'
  | 'thisWeek'
  | 'nextWeek'
  | 'thisMonth'
  | 'thisYear'
  | string;

export interface UpcomingSection<T = any> {
  key: UpcomingCategoryKey;
  title: string;
  tudus: T[];
}

export const getUpcomingCategoryInfo = (
  date: Date,
  baseDate: Date = new Date(),
  t?: (key: string, options?: any) => string,
): { key: UpcomingCategoryKey; title: string } => {
  const castDate = typeof date === 'string' ? new Date(date) : date;
  const targetTime = castDate.getTime();

  // Tomorrow end (23:59:59.999)
  const tomorrow = new Date(baseDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endOfTomorrow = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
    23,
    59,
    59,
    999,
  );

  if (targetTime <= endOfTomorrow.getTime()) {
    return {
      key: 'tomorrow',
      title: t ? t('upcomingSections.tomorrow') : 'Amanhã',
    };
  }

  // End of current week (Sunday 23:59:59.999)
  const dayOfWeek = baseDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const endOfCurrentWeek = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() + daysUntilSunday,
    23,
    59,
    59,
    999,
  );

  if (targetTime <= endOfCurrentWeek.getTime()) {
    return {
      key: 'thisWeek',
      title: t ? t('upcomingSections.thisWeek') : 'Esta semana',
    };
  }

  // Next week end (next Sunday 23:59:59.999)
  const startOfNextWeek = new Date(endOfCurrentWeek.getTime() + 1);
  const endOfNextWeek = new Date(
    startOfNextWeek.getFullYear(),
    startOfNextWeek.getMonth(),
    startOfNextWeek.getDate() + 6,
    23,
    59,
    59,
    999,
  );

  if (targetTime <= endOfNextWeek.getTime()) {
    return {
      key: 'nextWeek',
      title: t ? t('upcomingSections.nextWeek') : 'Próxima semana',
    };
  }

  // End of current month
  const endOfCurrentMonth = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  if (targetTime <= endOfCurrentMonth.getTime()) {
    return {
      key: 'thisMonth',
      title: t ? t('upcomingSections.thisMonth') : 'Este mês',
    };
  }

  // End of current year
  const endOfCurrentYear = new Date(
    baseDate.getFullYear(),
    11,
    31,
    23,
    59,
    59,
    999,
  );

  if (targetTime <= endOfCurrentYear.getTime()) {
    return {
      key: 'thisYear',
      title: t ? t('upcomingSections.thisYear') : 'Este ano',
    };
  }

  // Future years
  const year = castDate.getFullYear();
  return {
    key: `year-${year}`,
    title: `${year}`,
  };
};

export const groupTudusByUpcomingPeriod = <T extends { dueDate?: Date; hasTime?: boolean; scheduledOrder?: number }>(
  items: T[],
  t?: (key: string, options?: any) => string,
  baseDate: Date = new Date(),
): UpcomingSection<T>[] => {
  const sortedItems = [...items].sort((a, b) => {
    const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;

    const dateA = a.dueDate ? getDateOnlyTimeStamp(a.dueDate) : 0;
    const dateB = b.dueDate ? getDateOnlyTimeStamp(b.dueDate) : 0;

    if (dateA !== dateB) {
      return dateA - dateB;
    }

    if (a.hasTime && b.hasTime) {
      if (timeA !== timeB) {
        return timeA - timeB;
      }
    } else if (a.hasTime && !b.hasTime) {
      return -1;
    } else if (!a.hasTime && b.hasTime) {
      return 1;
    }

    return (a.scheduledOrder || 0) - (b.scheduledOrder || 0);
  });

  const sectionsMap = new Map<UpcomingCategoryKey, UpcomingSection<T>>();

  sortedItems.forEach(item => {
    if (!item.dueDate) {
      return;
    }
    const { key, title } = getUpcomingCategoryInfo(item.dueDate, baseDate, t);

    if (!sectionsMap.has(key)) {
      sectionsMap.set(key, {
        key,
        title,
        tudus: [],
      });
    }

    sectionsMap.get(key)!.tudus.push(item);
  });

  // Keep predictable order
  const fixedKeys: UpcomingCategoryKey[] = [
    'tomorrow',
    'thisWeek',
    'nextWeek',
    'thisMonth',
    'thisYear',
  ];

  const orderedSections: UpcomingSection<T>[] = [];

  fixedKeys.forEach(k => {
    if (sectionsMap.has(k)) {
      orderedSections.push(sectionsMap.get(k)!);
      sectionsMap.delete(k);
    }
  });

  // Remaining year keys sorted by year ascending
  const remainingSections = Array.from(sectionsMap.values()).sort((a, b) =>
    a.key.localeCompare(b.key),
  );

  return [...orderedSections, ...remainingSections];
};

