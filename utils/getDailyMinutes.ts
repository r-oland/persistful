export const getDailyMinutes = (activities: DailyActivityEntity[]) =>
  activities
    .map((a) =>
      a.countMode === 'times' && a.countCalc ? a.countCalc * a.count : a.count
    )
    .reduce((prev, cur) => prev + cur);
