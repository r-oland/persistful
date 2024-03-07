import { getDayAchievements } from 'utils/getDayAchievements';
import { add, differenceInCalendarDays, getWeek } from 'date-fns';
import { validateStreaksArgs } from 'pages/api/user/validateStreaks';

export function getStreakDays({ days, user }: validateStreaksArgs) {
  const secondChance = user.rules.secondChange;
  let missedChanceThisWeek = false;
  let currentWeek = getWeek(days[0].createdAt, { weekStartsOn: 1 });
  const streakDays: DayEntity[] = [];
  const secondChanceDates: Date[] = [];

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const weekNumber = getWeek(day.createdAt, { weekStartsOn: 1 });

    // Reset the second chance if it's a new week
    if (weekNumber !== currentWeek) {
      missedChanceThisWeek = false;
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
        if (secondChance && !missedChanceThisWeek) {
          // Use the second chance for this week
          missedChanceThisWeek = true;

          // This is the day before the missed day, so push 1 day ahead to the second chance dates
          secondChanceDates.push(add(day.createdAt, { days: 1 }));
        } else {
          // The streak is broken
          break;
        }
      }
    }

    // Check if the day contributes to the streak
    if (getDayAchievements(day).streak) {
      streakDays.push(day);
    } else if (secondChance && !missedChanceThisWeek) {
      // Use the second chance for this week
      missedChanceThisWeek = true;
      streakDays.push(day);
      secondChanceDates.push(day.createdAt);
    } else {
      // The streak is broken
      break;
    }
  }

  // Make sure that the first day in streak is not a second chance day
  const startDate =
    streakDays[streakDays.length - 1].createdAt || streakDays[0].createdAt;

  if (streakDays.length && secondChanceDates.includes(startDate)) {
    streakDays.pop();
    secondChanceDates.pop();
  }
  //

  return { streakDays, secondChanceDates };
}
