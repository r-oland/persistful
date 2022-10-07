// Components==============
import useGetDay from 'actions/day/useGetDay';
import useGetUser from 'actions/user/useGetUser';
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

export type ProgressCircleTypes = typeof defaultValues;

export const useDayData = (activeDay: Date) => {
  const [displayData, setDisplayData] = useState(defaultValues);

  const { data: user } = useGetUser();

  const { data: day } = useGetDay(activeDay);

  const { total, bonusScore, streak, phantomStreak } = getDayAchievements(
    day,
    true
  );

  const flatStreak = Math.floor(streak);

  // Calculate percentage of bonus time over daily goal
  const todayBonusTime = day?.rules?.prm
    ? bonusScore / (day?.rules?.dailyGoal || 0)
    : 0;

  // use a phantom streak if it exists
  const progress = getProgress(phantomStreak || streak);
  const bonusProgress = getProgress(todayBonusTime);

  const todayStamp = new Date().toLocaleDateString();
  const activeDayStamp = activeDay.toLocaleDateString();

  const displayStreak =
    // if active day is today
    todayStamp === activeDayStamp
      ? // grab calculated total streak from user && add daily streak
        (user?.streak || 0) + flatStreak
      : // grab streak directly from day since it's invalidated on each update
        flatStreak;

  const dailyGoal = convertMinutesToHours(day?.rules?.dailyGoal || 0);

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (day)
      setDisplayData({
        progress,
        bonusProgress,
        total,
        streak,
        displayStreak,
        dailyGoal,
        phantom: !!phantomStreak,
      });
  }, [useDeepComparison(day), user?.streak]);

  return displayData;
};
