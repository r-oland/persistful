// Components==============
import useGetActivities from 'actions/activity/useGetActivities';
import useGetDays from 'actions/day/useGetDays';
import { DashboardContext } from 'pages';
import React, { useContext, useEffect, useState } from 'react';
import { getActivitySum } from 'utils/getActivitySum';
import { getPastDay } from 'utils/getPastDay';
import Column from './Column/Column';
import styles from './Graph.module.scss';
// =========================

type ActivitiesSum = { _id: string; count: number }[];

export default function Graph() {
  const { activeDay } = useContext(DashboardContext);

  const [activitySums, setActivitySums] = useState<ActivitiesSum>([]);

  const lines = Array.from(Array(5).keys());

  // Change it so that it is 6 days in the past. -> not 7 because today also counts
  const lastWeek = getPastDay(activeDay, 6);

  const { data: activityEntities } = useGetActivities();
  const { data: days } = useGetDays(lastWeek, activeDay);

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

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {lines.map((line) => (
          <div
            className={styles.line}
            key={line}
            style={{ top: line * (233 / (lines.length - 1)) }}
          />
        ))}
        <div
          className={styles.graphs}
          style={{ gridTemplateColumns: `repeat(${activities.length}, 1fr)` }}
        >
          {activities.map(
            (activity) =>
              activity && (
                <Column
                  key={activity._id}
                  activities={activities}
                  activity={activity}
                />
              )
          )}
        </div>
      </div>
    </div>
  );
}
