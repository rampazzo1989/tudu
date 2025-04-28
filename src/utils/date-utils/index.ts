export const getDateOnlyTimeStamp = (date: Date) => {
  const castDate = typeof date === 'string' ? new Date(date) : date;
  return new Date(castDate.toDateString()).getTime();
};

export const isToday = (date: Date) =>
  getDateOnlyTimeStamp(date) === getDateOnlyTimeStamp(new Date());

export const isOutdated = (date: Date) =>
  getDateOnlyTimeStamp(date) < getDateOnlyTimeStamp(new Date());

export const formatToLocaleDate = (date: Date) =>
  date.toLocaleDateString();
