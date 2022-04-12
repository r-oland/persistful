import { convertMinutesToHours } from './convertMinutesToHours';

export const getActivityCount = (activity: ActivityEntity) =>
  activity.countMode === 'minutes'
    ? convertMinutesToHours(activity.count)
    : `${Math.floor(activity.count)}x`;
