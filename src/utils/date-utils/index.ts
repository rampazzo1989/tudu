export const getDateOnlyTimeStamp = (date: Date) =>
  new Date(date.toDateString()).getTime();
