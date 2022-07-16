// Components==============
import useGetActivities from 'actions/activity/useGetActivities';
import { useDeepComparison } from 'hooks/useDeepComparison';
import React, { useEffect, useRef, useState } from 'react';
import { getActivitySum } from 'utils/getActivitySum';
import Column from './Column/Column';
import styles from './Graph.module.scss';
// =========================

export default function Graph({
  days,
  isLoading,
}: {
  days?: DayEntity[];
  isLoading: boolean;
}) {
  const [activitySums, setActivitySums] = useState<DailyActivityEntity[]>([]);
  const [maxHeight, setMaxHeight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const lines = Array.from(Array(5).keys());

  const { data: activityEntities } = useGetActivities();

  useEffect(() => {
    if (isLoading) return;
    if (!days?.length && !isLoading) return setActivitySums([]);

    const activities: DailyActivityEntity[] = [];

    days?.forEach((day) =>
      day.activities.forEach((activity) => {
        const sum = getActivitySum([activity]);

        const activityIndex = activities.findIndex(
          (a) => a._id === activity._id
        );

        // Item is already in array
        if (activityIndex !== -1) {
          const item = activities[activityIndex];

          // add sum to total
          if (item) {
            item.count += sum;

            // The amount of times needs to be stored separately because this data can get lost if countCalc differs over days.
            if (activity.countMode === 'times') {
              if (!item.timesCount) item.timesCount = 0;
              item.timesCount += activity.count;
            }
          }
          return;
        }

        // init item in array
        return activities.push({
          ...activity,
          count: sum,
          timesCount: activity.countMode === 'times' ? activity.count : 0,
        });
      })
    );

    setActivitySums(activities);
  }, [useDeepComparison(days), isLoading]);

  // Grab activities from the daily snapshot to use the values that where used that day
  const activities = activitySums
    ?.map((activitySum) => {
      const activity = activityEntities
        // filter inactive activities without count
        ?.filter((a) => a.status === 'active' || activitySum.count)
        ?.find((a) => a._id === activitySum._id);
      // Overwrite values with snapshot if they differ from current activity
      if (activity) return { ...activity, ...activitySum };
      return undefined;
    })
    .filter((exists) => exists)
    .sort(
      (a, b) => (a?.penalty ? 1 : 0) - (b?.penalty ? 1 : 0)
    ) as ActivityEntity[];

  // dirty solution that sets height based on space that is left
  useEffect(() => {
    // content below column

    if (ref.current?.clientHeight !== undefined) {
      // if height < 180 -> graph height = 200
      if (ref.current.clientHeight < 180) return setMaxHeight(200);

      setMaxHeight(ref.current.clientHeight - 30);
    }
  }, [!!ref.current?.clientHeight]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {lines.map((line) => (
          <div
            className={styles.line}
            key={line}
            style={{
              top: line * (maxHeight / (lines.length - 1)),
            }}
          />
        ))}
        <div
          className={styles.graphs}
          style={{
            gridTemplateColumns: `repeat(${activities.length}, 1fr)`,
          }}
          ref={ref}
        >
          {activities.map(
            (activity) =>
              activity && (
                <Column
                  key={activity._id}
                  activities={activities}
                  activity={activity}
                  maxHeight={maxHeight}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
}
