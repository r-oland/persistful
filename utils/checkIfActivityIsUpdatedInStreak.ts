import { add } from 'date-fns';
import { setDateTime } from './setDateTime';

export const checkIfActivityIsUpdatedInStreak = (
  activeDay: Date,
  startDateStreak?: Date
) => {
  const activityIsUpdatedInStreak =
    setDateTime(
      startDateStreak
        ? // Previous day so rewards streak can also be decreased when the startDate is the same as the active day
          add(new Date(startDateStreak), { days: -1 })
        : // If there is no startDateGeneralStreak, we assume the streak started today
          new Date(),
      'start'
    ).getTime() <= activeDay.getTime();
  return activityIsUpdatedInStreak;
};
