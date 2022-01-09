import { getActivitySum } from './getActivitySum';

export const getActivityPercentage = (
  activity: ActivityEntity,
  activities?: DailyActivityEntity[]
) => {
  if (!activities?.length) return undefined;

  const total = getActivitySum(activities);
  if (!total) return undefined;

  const count =
    activity.countMode === 'times'
      ? activity.count * activity.countCalc
      : activity.count;
  const percentage = (100 / total) * count;

  return percentage;
};
