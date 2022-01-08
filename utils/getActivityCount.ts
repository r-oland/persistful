import { converMinutesToHours } from './convertMinutesToHours';

export const getActivityCount = (activity: ActivityEntity) =>
  activity.countMode === 'minutes'
    ? converMinutesToHours(activity.count)
    : `${Math.floor(activity.count)}x`;
