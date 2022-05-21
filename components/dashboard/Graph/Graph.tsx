// Components==============
import { IconName } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetActivities from 'actions/activity/useGetActivities';
import useGetDays from 'actions/day/useGetDays';
import { motion } from 'framer-motion';
import HardShadow from 'global_components/HardShadow/HardShadow';
import { DashboardContext } from 'pages';
import React, { useContext, useEffect, useState } from 'react';
import { framerFade } from 'utils/framerAnimations';
import { getActivitySum } from 'utils/getActivitySum';
import { getPastDay } from 'utils/getPastDay';
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
    .filter((exists) => exists);

  const total =
    activities.map((a) => a?.count || 0).reduce((prev, cur) => prev + cur, 0) ||
    0;

  const highestCount = Math.max(...activities.map((a) => a?.count || 0)) || 0;

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
          {activities.map((activity) => {
            if (!activity) return <></>;

            const maxHeight = 229;
            const renderPercentage = (100 / highestCount) * activity.count || 0;
            const percentage = Math.round((100 / total) * activity.count) || 0;

            const calcHeight = (maxHeight / 100) * renderPercentage;
            const height = calcHeight < 20 ? 19 : calcHeight;

            return (
              <div
                className={`${styles.column} ${
                  activity.penalty ? styles.penalty : ''
                }`}
                key={activity._id}
              >
                <HardShadow stretch>
                  <motion.div
                    className={styles.graph}
                    animate={{ height }}
                    initial={{ height: 19 }}
                    transition={{ duration: 0.8 }}
                    key={activity._id}
                  >
                    <div className={styles.top}>{percentage}%</div>
                    {calcHeight > 50 && (
                      <motion.div
                        className={styles.icon}
                        {...framerFade}
                        transition={{ duration: 0.8 }}
                      >
                        <FontAwesomeIcon icon={activity.icon as IconName} />
                      </motion.div>
                    )}
                  </motion.div>
                </HardShadow>
                <p>{activity.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
