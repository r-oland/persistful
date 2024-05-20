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
import {
  faEmptySet,
  faEye,
  faEyeSlash,
  faOctagonPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { ProgressContext } from 'pages/progress';
import { getDayAchievements } from 'utils/getDayAchievements';
import { differenceInDays } from 'date-fns';
import styles from './ActivityLineGraph.module.scss';
import ActivityCircles from './ActivityCircles/ActivityCircles';
import LineGraph from './LineGraph/LineGraph';
// =========================

type ActivityLineGraphDisplayMode = 'All days' | 'Active days';

export type DaySumType = { sum: number; date: Date; rules?: RulesEntity };

type ActivityLineGraphContextType = {
  activeActivity: string;
  setActiveActivity: React.Dispatch<React.SetStateAction<string>>;
  activities: ActivityEntity[];
  totalCount: number;
  daysSum: DaySumType[];
  displayMode: ActivityLineGraphDisplayMode;
};

export const ActivityLineGraphContext = createContext(
  {} as ActivityLineGraphContextType
);

const bonusActivity = {
  _id: 'bonusTime',
  name: 'Bonus time',
  count: 0,
  countCalc: 0,
  penalty: false,
  timesCount: 0,
  countMode: 'minutes' as const,
  createdAt: new Date(),
  icon: faOctagonPlus as any,
  status: 'active',
};

const addBonusTimeAsActivity = (days: DayEntity[]) =>
  days.map((day) => {
    if (!day.rules.prm) return day;

    const hasPenaltyActivities = day.activities.some(
      (a) => a.penalty && a.count > 0
    );

    if (hasPenaltyActivities) return day;

    // Else add bonus time as an activity
    const activities = [
      ...day.activities,
      { ...bonusActivity, count: day.rules.bonusTime },
    ];
    return { ...day, activities };
  });

export default function ActivityLineGraph() {
  const [activities, setActivities] = useState<ActivityEntity[]>([]);
  const [daysSum, setDaysSum] = useState<DaySumType[]>([]);
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

  const noMissingDaysInSum = useMemo(
    () => dayEntities?.length === differenceInDays(range.to, range.from) + 1,
    [dayEntities, range]
  );

  useEffect(() => {
    if (isLoading) return;
    if (!dayEntities?.length && !isLoading)
      return setActivities([
        {
          _id: '',
          userId: '',
          name: 'No data',
          count: 0,
          countCalc: 30,
          penalty: true,
          timesCount: 0,
          countMode: 'minutes',
          createdAt: new Date(),
          icon: faEmptySet as any,
          status: 'active',
        },
      ]);

    const sums = (addBonusTimeAsActivity(dayEntities) || [])
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
        const activity = [...(activityEntities || []), bonusActivity]?.find(
          (a) => a._id === activitySum._id
        );
        if (activity) return { ...activity, ...activitySum };
        return undefined;
      })
      .filter(Boolean)
      // Highest count first
      .sort((a, b) => (b?.count || 0) - (a?.count || 0))
      // Bonus time after that
      .sort(
        (a, b) =>
          (a?._id === 'bonusTime' ? 1 : 0) - (b?._id === 'bonusTime' ? 1 : 0)
      )
      // Penalty time last
      .sort(
        (a, b) => (a?.penalty ? 1 : 0) - (b?.penalty ? 1 : 0)
      ) as ActivityEntity[];

    setActivities(combinedActivities);
  }, [useDeepComparison(dayEntities), isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!dayEntities?.length && !isLoading) return setDaysSum([]);

    const sums: DaySumType[] = [];

    const filteredDayEntities =
      addBonusTimeAsActivity(dayEntities)?.map((d) =>
        activeActivity
          ? {
              ...d,
              activities: d.activities.filter((a) => activeActivity === a._id),
            }
          : d
      ) || [];

    filteredDayEntities.forEach((d) => {
      let sum = 0;

      // Display sum isolated to the activity
      if (activeActivity) sum = getActivitySum(d.activities);
      else {
        // Display sum of all activities including bonus time and penalties
        const { total, bonusScore } = getDayAchievements(d);
        // Subtract bonus time as it's already included as an activity
        sum = total - bonusScore;
      }
      sums.push({ sum, date: new Date(d.createdAt), rules: d.rules });
    });

    if (displayMode === 'All days') {
      // Take a snapshot of the sums for reference
      const sumSnapshot = new Map(
        sums.map((s) => [s.date.toLocaleDateString(), s])
      );

      // Reset the sums array
      sums.length = 0;

      const firstDate = new Date(range.from);
      const lastDate = new Date(range.to);

      // Loop through the range and fill in the missing days
      for (let d = firstDate; d <= lastDate; d.setDate(d.getDate() + 1)) {
        const dayWithSum = sumSnapshot.get(d.toLocaleDateString());

        if (!dayWithSum) {
          sums.push({ sum: 0, date: new Date(d) });
        } else sums.push(dayWithSum);
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
            className={`${styles['day-selector']} ${noMissingDaysInSum ? styles.disabled : ''}`}
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
