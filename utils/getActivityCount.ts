import { converMinutesToHours } from './convertMinutesToHours';

export const getActivityCount = (activity: ActivityEntity) =>
  activity.countMode === 'minutes'
    ? converMinutesToHours(activity.count)
    : `${activity.count}x`;
