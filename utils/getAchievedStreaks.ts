import { getActivitySum } from 'utils/getActivitySum';

// helper func that gets amount of achieved streaks
export const getAchievedStreaks = (
  day?: DayEntity | null,
  withDecimals?: boolean
) => {
  if (!day) return 0;
  if (!day.activities.length) return 0;

  // activities
  const totalPositive = getActivitySum(
    day.activities.filter((a) => !a.penalty)
  );

  // penalities
  const totalNegative = getActivitySum(day.activities.filter((a) => a.penalty));

  const positiveReinforcementMode = day?.rules.prm;
  // possible if you have prm enabled -> will happen when you have no penalty activities
  const bonusScore = totalNegative === 0 ? day.rules.bonusTime : 0;

  const total = positiveReinforcementMode
    ? totalPositive + bonusScore
    : totalPositive - totalNegative;

  const goal = day.rules.dailyGoal;
  const streaks = withDecimals ? total / goal : Math.floor(total / goal);

  // prevent negative streaks
  if (streaks < 0) return 0;

  // prevent streaks from going further then 3
  if (streaks > 3) return 3;

  return streaks;
};
