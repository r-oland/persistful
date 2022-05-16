export const setDateTime = (date: Date, time: 'start' | 'middle' | 'end') =>
  time === 'start'
    ? new Date(date.setUTCHours(0, 0, 0, 0))
    : time === 'end'
    ? new Date(date.setUTCHours(23, 59, 59, 999))
    : // time === 'middle'
      new Date(date.setUTCHours(12, 0, 0, 0));
