// Components==============
import { useDeepComparison } from 'hooks/useDeepComparison';
import { useEffect, useState } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getProgress } from 'utils/getProgress';
//

const defaultValues = {
  progress: [0, 0, 0],
  bonusProgress: [0, 0, 0],
  total: 0,
  streak: 0,
  displayStreak: 0,
  dailyGoal: '0:00',
  phantom: false,
};

export type DayDataTypes = typeof defaultValues;

export const useRangeData = (days?: DayEntity[], isLoading?: boolean) => {
  const [displayData, setDisplayData] = useState(defaultValues);

  const amountOfDays = days?.length || 0;

  // calc total
  const totalDays =
    days
      ?.map((d) => getDayAchievements(d, true).total)
      .reduce((prev, cur) => prev + cur, 0) || 0;

  const total = Math.floor(totalDays / amountOfDays);

  // calc daily goal
  const totalDailyGoal =
    days?.map((d) => d.rules.dailyGoal).reduce((prev, cur) => prev + cur, 0) ||
    0;

  const averageGoal = totalDailyGoal / amountOfDays;
  const dailyGoal = convertMinutesToHours(averageGoal);

  const rawStreak = total / averageGoal;
  const streak = rawStreak < 0 ? 0 : rawStreak;

  // Rounded per day
  const displayStreak =
    days
      ?.map((d) => getDayAchievements(d).streak)
      .reduce((prev, cur) => prev + cur, 0) || 0;

  // calc bonus time
  const totalBonusTime =
    days
      ?.map((d) => {
        const { bonusScore } = getDayAchievements(d, true);

        return d.rules.prm ? bonusScore / (d.rules.dailyGoal || 0) : 0;
      })
      .reduce((prev, cur) => prev + cur, 0) || 0;

  const averageBonusTime = totalBonusTime / amountOfDays;

  // calc progress
  const progress = getProgress(streak);
  const bonusProgress =
    streak === 0 ? [0, 0, 0] : getProgress(averageBonusTime);

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (isLoading) return;
    // if day doesn't exists in overview page -> reset data
    if (!days?.length && !isLoading) return setDisplayData(defaultValues);

    if (days)
      return setDisplayData({
        progress,
        bonusProgress,
        total,
        streak,
        displayStreak,
        dailyGoal,
        phantom: false,
      });
  }, [useDeepComparison(days), isLoading]);

  return displayData;
};
