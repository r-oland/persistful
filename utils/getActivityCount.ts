import { convertMinutesToHours } from './convertMinutesToHours';

export const getActivityCount = (
  activity: ActivityEntity,
  calcReduction = false
) =>
  activity.countMode === 'minutes'
    ? convertMinutesToHours(activity.count)
    : calcReduction
    ? `${activity.count / activity.countCalc}x`
    : `${Math.floor(activity.count)}x`;
