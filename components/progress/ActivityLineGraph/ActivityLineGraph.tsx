// Components==============
import React, {
  useEffect,
  useState,
  useMemo,
  createContext,
  useContext,
} from 'react';
import useGetProgressDays from 'actions/day/useGetProgressDays';
import { useDeepComparison } from 'hooks/useDeepComparison';
import { getActivitySum } from 'utils/getActivitySum';
import useGetActivities from 'actions/activity/useGetActivities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons';
import { ProgressContext } from 'pages/progress';
import styles from './ActivityLineGraph.module.scss';
import ActivityCircles from './ActivityCircles/ActivityCircles';
import LineGraph from './LineGraph/LineGraph';
// =========================

type ActivityLineGraphDisplayMode = 'All days' | 'Active days';

type ActivityLineGraphContextType = {
  activeActivity: string;
  setActiveActivity: React.Dispatch<React.SetStateAction<string>>;
  activities: ActivityEntity[];
  totalCount: number;
  daysSum: { sum: number; date: Date }[];
  displayMode: ActivityLineGraphDisplayMode;
};

export const ActivityLineGraphContext = createContext(
  {} as ActivityLineGraphContextType
);

export default function ActivityLineGraph() {
  const [activities, setActivities] = useState<ActivityEntity[]>([]);
  const [daysSum, setDaysSum] = useState<{ sum: number; date: Date }[]>([]);
  const { data: activityEntities } = useGetActivities();
  const { data: dayEntities, isLoading } = useGetProgressDays();
  const [activeActivity, setActiveActivity] = useState('');
  const [displayMode, setDisplayMode] =
    useState<ActivityLineGraphDisplayMode>('All days');

  const { range } = useContext(ProgressContext);

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

    const sums: { sum: number; date: Date }[] = [];

    const filteredDayEntities =
      dayEntities?.map((d) =>
        activeActivity
          ? {
              ...d,
              activities: d.activities.filter((a) => activeActivity === a._id),
            }
          : d
      ) || [];

    filteredDayEntities.forEach((d) => {
      const sum = getActivitySum(d.activities);
      sums.push({ sum, date: new Date(d.createdAt) });
    });

    if (displayMode === 'All days') {
      // Take a snapshot of the sums for reference
      const sumSnapshot = [...sums];

      // Reset the sums array
      sums.length = 0;

      const firstDate = new Date(range.from);
      const lastDate = new Date(range.to);

      // Loop through the range and fill in the missing days
      for (let d = firstDate; d <= lastDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toLocaleDateString();
        const dayWithSum = sumSnapshot.find(
          (s) => s.date.toLocaleDateString() === dateString
        );

        if (!dayWithSum) sums.push({ sum: 0, date: new Date(d) });
        else sums.push(dayWithSum);
      }
    }

    setDaysSum(sums);
  }, [
    useDeepComparison(range),
    useDeepComparison(dayEntities),
    isLoading,
    activeActivity,
    displayMode,
  ]);

  const value = useMemo(
    () => ({
      activeActivity,
      setActiveActivity,
      activities,
      totalCount,
      daysSum,
      displayMode,
    }),
    [activeActivity, activities, totalCount, daysSum, displayMode]
  );

  return (
    <ActivityLineGraphContext.Provider value={value}>
      <div className={styles.wrapper}>
        <div className={styles.top}>
          <p className={styles.title}>Activities</p>
          <div
            className={styles['day-selector']}
            onClick={() =>
              setDisplayMode(
                displayMode === 'All days' ? 'Active days' : 'All days'
              )
            }
          >
            <FontAwesomeIcon
              icon={displayMode === 'Active days' ? faEyeSlash : faEye}
            />{' '}
            {displayMode}
          </div>
        </div>
        <div className={styles.content}>
          <ActivityCircles />
          <div className={styles.bar} />
          <LineGraph />
        </div>
      </div>
    </ActivityLineGraphContext.Provider>
  );
}
