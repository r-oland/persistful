import React, { useContext } from 'react';
import styles from './ActivityCircles.module.scss';
import ActivityCircle from './ActivityCircle/ActivityCircle';
import { ActivityLineGraphContext } from '../ActivityLineGraph';

export default function ActivityCircles() {
  const { activeActivity, setActiveActivity, activities, totalCount } =
    useContext(ActivityLineGraphContext);

  return (
    <div className={styles.wrapper}>
      {activities?.map((activity) => (
        <div
          key={activity._id}
          className={`${styles.activity} ${activeActivity && activity._id !== activeActivity && styles.inactive}`}
          onClick={() =>
            activeActivity === activity._id
              ? setActiveActivity('')
              : setActiveActivity(activity._id)
          }
        >
          <ActivityCircle totalCount={totalCount} activity={activity} />
          <p className={styles.name}>{activity.name}</p>
        </div>
      ))}
    </div>
  );
}
