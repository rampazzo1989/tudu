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
