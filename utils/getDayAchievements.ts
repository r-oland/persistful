import { getActivitySum } from 'utils/getActivitySum';

const getStreak = (
  day: DayEntity,
  totalPositive: number,
  withDecimals?: boolean
) => {
  // penalities
  const totalNegative = getActivitySum(day.activities.filter((a) => a.penalty));

  const positiveReinforcementMode = day?.rules.prm;
  // possible if you have prm enabled -> will happen when you have no penalty activities
  const bonusScore = positiveReinforcementMode
    ? totalNegative === 0
      ? day.rules.bonusTime
      : 0
    : 0;

  const total = positiveReinforcementMode
    ? totalPositive + bonusScore
    : totalPositive - totalNegative;

  const goal = day.rules.dailyGoal;
  const streaksResult = withDecimals ? total / goal : Math.floor(total / goal);

  // prevent negative streaks && prevent streaks from going further then 3
  const streak = streaksResult < 0 ? 0 : streaksResult > 3 ? 3 : streaksResult;

  return [streak, total, bonusScore];
};

// helper func that gets amount of achieved streaks
export const getDayAchievements = (
  day?: DayEntity | null,
  withDecimals?: boolean
) => {
  if (!day || !day.activities.length)
    return { streak: 0, total: 0, bonusScore: 0, phantomStreak: 0 };

  // get positive activity sums
  const positiveSum = getActivitySum(day.activities.filter((a) => !a.penalty));
  const amountOfActivitiesDone = day.activities.filter(
    (d) => !d.penalty && d.count
  ).length;

  const totalPositive = day.rules.balance
    ? // Check if more than one activity is done
      amountOfActivitiesDone > 1
      ? // If it is, then we can use the sum of all activities
        positiveSum
      : // if it's not, no positive score will be counted
        0
    : positiveSum;

  const [streak, total, bonusScore] = getStreak(
    day,
    totalPositive,
    withDecimals
  );

  const [phantomStreak] =
    // The user has only completed one activity and has balance mode enabled
    amountOfActivitiesDone === 1 && day.rules.balance
      ? // Return what the user could have earned if they had completed more activities
        getStreak(day, positiveSum, withDecimals)
      : [0];

  return { streak, total, bonusScore, phantomStreak };
};
