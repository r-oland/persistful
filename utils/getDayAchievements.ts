import { getActivitySum } from 'utils/getActivitySum';

// helper func that gets amount of achieved streaks
export const getDayAchievements = (
  day?: DayEntity | null,
  withDecimals?: boolean
) => {
  if (!day || !day.activities.length)
    return { streak: 0, total: 0, bonusScore: 0 };

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
  const streaksResult = withDecimals ? total / goal : Math.floor(total / goal);

  // prevent negative streaks && prevent streaks from going further then 3
  const streak = streaksResult < 0 ? 0 : streaksResult > 3 ? 3 : streaksResult;

  return { streak, total, bonusScore };
};
