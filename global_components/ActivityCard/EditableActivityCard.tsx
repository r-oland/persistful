// Components==============
import { IconName } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetDay from 'actions/day/useGetDay';
import useUpdateActivityCount from 'actions/day/useUpdateActivityCount';
import React from 'react';
import { getActivityCount } from 'utils/getActivityCount';
import styles from './ActivityCard.module.scss';
// =========================

export default function EditableActivityCard({
  activity,
}: {
  activity: ActivityEntity;
}) {
  const { data: day } = useGetDay(new Date());
  const { mutate } = useUpdateActivityCount();

  if (!day) return null;

  return (
    <div
      className={`${styles.wrapper}  ${activity.penalty ? styles.penalty : ''}`}
      onClick={() =>
        mutate({
          id: day._id,
          activityId: activity._id,
          value: 10,
        })
      }
    >
      <div className={styles.content}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={activity.icon as IconName} />
        </div>
        <div className={styles.info}>
          <p>{activity.name}</p>
          <h3>{getActivityCount(activity)}</h3>
        </div>
      </div>
      <div className={styles.bar} />
    </div>
  );
}