// To calculate the no. of days between two dates
export const getDifferenceInDays = (date1: Date, date2: Date) =>
  Math.floor(
    (new Date(date2).getTime() - new Date(date1).getTime()) / (1000 * 3600 * 24)
  );
