export const getActivitySum = (
  activities?: DailyActivityEntity[],
  penalize?: boolean
) => {
  if (!activities?.length) return 0;

  const total =
    activities
      .map((a) => {
        let count =
          a.countMode === 'times' && a.countCalc
            ? a.count * a.countCalc
            : a.count;

        // Return the count as negative if the activity has a penalty
        if (penalize && a.penalty) {
          count = -count;
        }

        return count;
      })
      .reduce((prev, cur) => (prev || 0) + (cur || 0)) || 0;

  return total;
};
