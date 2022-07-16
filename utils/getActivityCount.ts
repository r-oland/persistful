import { convertMinutesToHours } from './convertMinutesToHours';

export const getActivityCount = (activity: DailyActivityEntity) =>
  activity.countMode === 'minutes'
    ? convertMinutesToHours(activity.count)
    : `${Math.floor(activity?.timesCount || activity.count)}x`;
