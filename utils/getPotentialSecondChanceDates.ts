import { endOfWeek, startOfWeek } from 'date-fns';
import { setDateTime } from 'utils/setDateTime';

export const getPotentialSecondChanceDates = (
  potentialSecondChanceDates: Date[][],
  d: Date
) => {
  let newValue = potentialSecondChanceDates;

  const lastAddedWeek =
    potentialSecondChanceDates[potentialSecondChanceDates.length - 1];

  const dayInWeek = lastAddedWeek?.[0].getTime();

  const weekStart = setDateTime(
    startOfWeek(dayInWeek, { weekStartsOn: 1 }),
    'start'
  ).getTime();

  const weekEnd = setDateTime(
    endOfWeek(dayInWeek, { weekStartsOn: 1 }),
    'end'
  ).getTime();

  // Another second chance was used in the last week -> add the current day to that array
  if (d.getTime() > weekStart && d.getTime() < weekEnd) {
    newValue[newValue.length - 1] = [...lastAddedWeek, d];
    return newValue;
  }

  // no second chance was used in the last entry -> add a new array with this new week
  newValue = [...newValue, [d]];
  return newValue;
};
