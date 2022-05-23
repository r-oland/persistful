// Components==============
import useGetActivities from 'actions/activity/useGetActivities';
import useGetDays from 'actions/day/useGetDays';
import React, { useEffect, useRef, useState } from 'react';
import { getActivitySum } from 'utils/getActivitySum';
import Column from './Column/Column';
import styles from './Graph.module.scss';
// =========================

type ActivitiesSum = { _id: string; count: number }[];

export default function Graph({ range }: { range: Date[] }) {
  const [activitySums, setActivitySums] = useState<ActivitiesSum>([]);
  const [maxHeight, setMaxHeight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  const lines = Array.from(Array(5).keys());

  const { data: activityEntities } = useGetActivities();
  const { data: days } = useGetDays(range[0], range[1]);

  useEffect(() => {
    if (!days?.length) return;

    const activities: ActivitiesSum = [];

    days.forEach((day) =>
      day.activities.forEach((activity) => {
        const sum = getActivitySum([activity]);

        const activityIndex = activities.findIndex(
          (a) => a._id === activity._id
        );

        // Item is already in array
        if (activityIndex !== -1) {
          const item = activities[activityIndex];

          // add sum to total
          if (item) item.count += sum;
          return;
        }

        // init item in array
        return activities.push({ _id: activity._id, count: sum });
      })
    );

    setActivitySums(activities);
  }, [JSON.stringify(days)]);

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
    .filter((exists) => exists) as ActivityEntity[];

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
