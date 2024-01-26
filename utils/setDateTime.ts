import { addHours, endOfDay, startOfDay } from 'date-fns';

export const setDateTime = (date: Date, time: 'start' | 'middle' | 'end') =>
  time === 'start'
    ? startOfDay(date)
    : time === 'end'
      ? endOfDay(date)
      : // time === 'middle'
        addHours(startOfDay(date), 12);
