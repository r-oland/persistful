export const getActivitySum = (activities?: DailyActivityEntity[]) => {
  if (!activities?.length) return 0;

  const total =
    activities
      .map((a) => {
        const count =
          a.countMode === 'times' && a.countCalc
            ? a.count * a.countCalc
            : a.count;

        return count;
      })
      .reduce((prev, cur) => (prev || 0) + (cur || 0)) || 0;

  return total;
};
