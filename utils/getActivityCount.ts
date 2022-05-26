import { convertMinutesToHours } from './convertMinutesToHours';

export const getActivityCount = (
  activity: DailyActivityEntity,
  calcReduction = false
) =>
  activity.countMode === 'minutes'
    ? convertMinutesToHours(activity.count)
    : calcReduction
    ? `${activity.count / (activity.countCalc || 0)}x`
    : `${Math.floor(activity.count)}x`;
