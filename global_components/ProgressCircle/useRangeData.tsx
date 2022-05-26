// Components==============
import useGetDays from 'actions/day/useGetDays';
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
};

export type DayDataTypes = typeof defaultValues;

export const useRangeData = (range: Date[]) => {
  const [displayData, setDisplayData] = useState(defaultValues);

  const {
    data: days,
    isLoading,
    isLoadingError,
  } = useGetDays(range[0], range[1], {
    // retry = false because days range can be selected that doesn't exists. This prevents it from trying to query in it on fail
    retry: false,
  });

  const amountOfDays = days?.length || 0;

  // calc total
  const totalDays =
    days
      ?.map((d) => getDayAchievements(d, true).total)
      .reduce((prev, cur) => prev + cur) || 0;

  const total = Math.floor(totalDays / amountOfDays);

  // Not rounded per day
  const streak =
    days
      ?.map((d) => getDayAchievements(d, true).streak)
      .reduce((prev, cur) => prev + cur) || 0;

  // Rounded per day
  const displayStreak =
    days
      ?.map((d) => getDayAchievements(d).streak)
      .reduce((prev, cur) => prev + cur) || 0;

  const averageStreak = streak / amountOfDays;

  // calc bonus time
  const totalBonusTime =
    days
      ?.map((d) => {
        const { bonusScore } = getDayAchievements(d, true);

        return d.rules.prm ? bonusScore / (d.rules.dailyGoal || 0) : 0;
      })
      .reduce((prev, cur) => prev + cur) || 0;

  const averageBonusTime = totalBonusTime / amountOfDays;

  // calc progress
  const progress = getProgress(averageStreak);
  const bonusProgress = getProgress(averageBonusTime);

  // calc daily goal
  const totalDailyGoal =
    days?.map((d) => d.rules.dailyGoal).reduce((prev, cur) => prev + cur) || 0;

  const dailyGoal = convertMinutesToHours(totalDailyGoal / amountOfDays);

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (days)
      return setDisplayData({
        progress,
        bonusProgress,
        total,
        streak,
        displayStreak,
        dailyGoal,
      });

    // if day doesn't exists in overview page -> reset data
    if (!days && !isLoading) setDisplayData(defaultValues);
  }, [range[0].getTime(), !!days, isLoadingError]);

  return displayData;
};
