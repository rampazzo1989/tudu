export const getDateOnlyTimeStamp = (date: Date) =>
  new Date(date.toDateString()).getTime();

export const isToday = (date: Date) =>
  getDateOnlyTimeStamp(date) === getDateOnlyTimeStamp(new Date());
