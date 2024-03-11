import React, { useEffect, useState, useMemo } from 'react';
import useGetProgressDays from 'actions/day/useGetProgressDays';
import { useDeepComparison } from 'hooks/useDeepComparison';
import { getActivitySum } from 'utils/getActivitySum';
import useGetActivities from 'actions/activity/useGetActivities';
import styles from './ActivityCircles.module.scss';
import ActivityCircle from './ActivityCircle/ActivityCircle';

export default function ActivityCircles() {
  const { data: days, isLoading } = useGetProgressDays();
  const [activitySums, setActivitySums] = useState<DailyActivityEntity[]>([]);
  const { data: activityEntities } = useGetActivities();

  const activities = useMemo(
    () =>
      activitySums
        ?.map((activitySum) => {
          const activity = activityEntities?.find(
            (a) => a._id === activitySum._id
          );
          if (activity) return { ...activity, ...activitySum };
          return undefined;
        })
        .filter(Boolean)
        // Highest count first
        .sort((a, b) => (b?.count || 0) - (a?.count || 0))
        // Penalty last
        .sort(
          (a, b) => (a?.penalty ? 1 : 0) - (b?.penalty ? 1 : 0)
        ) as ActivityEntity[],
    [activitySums, activityEntities]
  );

  const totalCount = useMemo(
    () => activities?.reduce((total, item) => total + item.count, 0) || 0,
    [activities]
  );

  useEffect(() => {
    if (isLoading) return;
    if (!days?.length && !isLoading) return setActivitySums([]);

    const sums = (days || [])
      .flatMap((day) => day.activities)
      .reduce((acc: DailyActivityEntity[], activity) => {
        const sum = getActivitySum([activity]);
        const existingActivity = acc.find((a) => a._id === activity._id);

        if (existingActivity) {
          existingActivity.count += sum;
          if (activity.countMode === 'times') {
            if (!existingActivity.timesCount) existingActivity.timesCount = 0;
            existingActivity.timesCount += activity.count;
          }
        } else {
          acc.push({
            ...activity,
            count: sum,
            timesCount: activity.countMode === 'times' ? activity.count : 0,
          });
        }

        return acc;
      }, []);

    setActivitySums(sums);
  }, [useDeepComparison(days), isLoading]);

  return (
    <div className={styles.wrapper}>
      {activities?.map((activity) => (
        <div key={activity._id} className={styles.activity}>
          <ActivityCircle totalCount={totalCount} activity={activity} />
          <p className={styles.name}>{activity.name}</p>
        </div>
      ))}
    </div>
  );
}
