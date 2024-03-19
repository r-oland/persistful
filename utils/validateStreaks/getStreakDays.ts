import { getDayAchievements } from 'utils/getDayAchievements';
import { add, differenceInCalendarDays, getWeek, sub } from 'date-fns';
import { WithId } from 'mongodb';

export function getStreakDays({
  days,
  user,
}: {
  days: WithId<DayEntity>[];
  user: WithId<UserEntity>;
}) {
  const secondChance = user.rules.secondChange;
  let currentWeek = getWeek(days[0].createdAt);
  const streakDays: DayEntity[] = [];
  const secondChanceDates: Date[] = [];
  const getSecondChanceDatesInLastWeek = (week: number) =>
    secondChanceDates.filter(
      (date) => getWeek(date, { weekStartsOn: 1 }) === week
    );

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const weekNumber = getWeek(day.createdAt);

    // Reset the second chance if it's a new week
    if (weekNumber !== currentWeek) {
      const secondChanceDatesInLastWeek =
        getSecondChanceDatesInLastWeek(currentWeek);

      // There should never be more then 1 second chance date in a week -> make corrections in this week and break loop
      if (secondChanceDatesInLastWeek.length > 1) {
        // clear second chance dates for this week
        const secondChanceDateIndex = secondChanceDates.findIndex(
          (sd) => sd === secondChanceDatesInLastWeek[0]
        );
        if (secondChanceDateIndex > -1)
          secondChanceDates.splice(secondChanceDateIndex);
        //

        // clear streak days for this week starting from the last second chance date
        const streakDayIndex = streakDays.findIndex(
          (sd) =>
            sd.createdAt.getTime() < secondChanceDatesInLastWeek[0].getTime()
        );

        if (streakDayIndex > -1) streakDays.splice(streakDayIndex);
        //

        break;
      }

      currentWeek = weekNumber;
    }

    // Check if there's a gap in days
    if (i > 0) {
      const gap = differenceInCalendarDays(
        days[i - 1].createdAt,
        day.createdAt
      );

      if (gap > 2) break; // Gap can never be more then 1 day -> always break the streak

      // gap 2 = 1 missed day
      if (gap === 2) {
        if (secondChance) {
          // This might look weird, but it's correct
          const nextDayHasStreak = !!getDayAchievements(day).streak;

          // Make sure the next day after the gap has a streak
          if (nextDayHasStreak) {
            // This is the day before the missed day, so push 1 day ahead to the second chance dates
            secondChanceDates.push(add(day.createdAt, { days: 1 }));
          } else break;
        } else {
          // The streak is broken
          break;
        }
      }
    }

    // Check if the day contributes to the streak
    if (getDayAchievements(day).streak) {
      streakDays.push(day);
    } else if (secondChance) {
      // Get the day before the current day
      const nextDay = days.find(
        (d) =>
          d.createdAt.toLocaleDateString() ===
          sub(day.createdAt, { days: 1 }).toLocaleDateString()
      );

      // Check if the day before the current day has a streak
      const nextDayHasStreak = !!getDayAchievements(nextDay).streak;

      // Make sure the day before the current day has a valid streak
      if (nextDayHasStreak) {
        // Use the second chance for this week
        secondChanceDates.push(day.createdAt);
      } else break;
    } else {
      // The streak is broken
      break;
    }
  }

  return { streakDays, secondChanceDates };
}
