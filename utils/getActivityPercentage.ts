export const getActivityPercentage = (
  activity: ActivityEntity,
  activities?: DailyActivityEntity[]
) => {
  if (!activities?.length) return undefined;

  const total =
    activities
      .map((a) =>
        a.countMode === 'times' && a.countCalc ? a.count * a.countCalc : a.count
      )
      .reduce((prev, cur) => (prev || 0) + (cur || 0)) || 0;

  const count =
    activity.countMode === 'times'
      ? activity.count * activity.countCalc
      : activity.count;
  const percentage = (100 / total) * count;

  return percentage;
};
