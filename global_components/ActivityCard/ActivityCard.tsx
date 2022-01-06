// Components==============
import useGetDay from 'actions/day/useGetDay';
import useUpdateActivityCount from 'actions/day/useUpdateActivityCount';
import React from 'react';
import styles from './ActivityCard.module.scss';
// =========================

export default function ActivityCard({
  activity,
}: {
  activity: ActivityEntity;
}) {
  const { data: day } = useGetDay(new Date());
  const { mutate } = useUpdateActivityCount();

  if (!day) return null;

  return (
    <div
      className={styles.wrapper}
      onClick={() =>
        mutate({
          id: day._id,
          activityId: activity._id,
          value: 1,
        })
      }
    >
      <p>{activity.name}</p>
      <h3>{activity.count}</h3>
    </div>
  );
}
