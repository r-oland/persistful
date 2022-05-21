export const getPastDay = (date: Date, amountOfDays: number) =>
  new Date(date.getTime() - 24 * 60 * 60 * 1000 * amountOfDays);
