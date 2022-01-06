export const getDailyMinutes = (activities: DailyActivityEntity[]) => {
  if (!activities.length) return 0;

  return activities
    .map((a) =>
      a.countMode === 'times' && a.countCalc ? a.countCalc * a.count : a.count
    )
    .reduce((prev, cur) => prev + cur);
};
