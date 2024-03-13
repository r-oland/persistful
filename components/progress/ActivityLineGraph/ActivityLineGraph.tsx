// Components==============
import React, { useEffect, useState, useMemo, createContext } from 'react';
import useGetProgressDays from 'actions/day/useGetProgressDays';
import { useDeepComparison } from 'hooks/useDeepComparison';
import { getActivitySum } from 'utils/getActivitySum';
import useGetActivities from 'actions/activity/useGetActivities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-solid-svg-icons';
import styles from './ActivityLineGraph.module.scss';
import ActivityCircles from './ActivityCircles/ActivityCircles';
import LineGraph from './LineGraph/LineGraph';
// =========================

type ActivityLineGraphContextType = {
  activeActivity: string;
  setActiveActivity: React.Dispatch<React.SetStateAction<string>>;
  activities: ActivityEntity[];
  totalCount: number;
  daysSum: number[];
};

export const ActivityLineGraphContext = createContext(
  {} as ActivityLineGraphContextType
);

export default function ActivityLineGraph() {
  const [activities, setActivities] = useState<ActivityEntity[]>([]);
  const [daysSum, setDaysSum] = useState<number[]>([]);
  const { data: activityEntities } = useGetActivities();
  const { data: dayEntities, isLoading } = useGetProgressDays();
  const [activeActivity, setActiveActivity] = useState('');

  const totalCount = useMemo(
    () => activities?.reduce((total, item) => total + item.count, 0) || 0,
    [activities]
  );

  useEffect(() => {
    if (isLoading) return;
    if (!dayEntities?.length && !isLoading) return setActivities([]);

    const sums = (dayEntities || [])
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

    const combinedActivities = sums
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
      ) as ActivityEntity[];

    setActivities(combinedActivities);
  }, [useDeepComparison(dayEntities), isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!dayEntities?.length && !isLoading) return setActivities([]);

    setDaysSum(
      dayEntities
        .map((d) =>
          activeActivity
            ? {
                ...d,
                activities: d.activities.filter(
                  (a) => activeActivity === a._id
                ),
              }
            : d
        )
        .map((d) => {
          const sum = d.activities.reduce((acc, a) => acc + a.count, 0);
          return sum;
        }) || []
    );
  }, [useDeepComparison(dayEntities), isLoading, activeActivity]);

  const value = useMemo(
    () => ({
      activeActivity,
      setActiveActivity,
      activities,
      totalCount,
      daysSum,
    }),
    [activeActivity, activities, totalCount, daysSum]
  );

  return (
    <ActivityLineGraphContext.Provider value={value}>
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <p className={styles.title}>Activities</p>
          <p className={styles['day-selector']}>
            <FontAwesomeIcon icon={faEye} /> All days
          </p>
        </div>
        <div className={styles.content}>
          <ActivityCircles />
          <div className={styles.bar} />
          {!!daysSum.length && <LineGraph />}
        </div>
      </div>
    </ActivityLineGraphContext.Provider>
  );
}
