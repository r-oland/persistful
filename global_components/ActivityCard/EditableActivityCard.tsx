// Components==============
import { IconName } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetDay from 'actions/day/useGetDay';
import useUpdateActivityCount from 'actions/day/useUpdateActivityCount';
import React from 'react';
import { getActivityCount } from 'utils/getActivityCount';
import { getActivityPercentage } from 'utils/getActivityPercentage';
import ActivityProgress from './ActivityProgress/ActivityProgress';
import styles from './ActivityCard.module.scss';
// =========================

export default function EditableActivityCard({
  activity,
}: {
  activity: ActivityEntity;
}) {
  const { data: day } = useGetDay(new Date());
  const { mutate } = useUpdateActivityCount();

  const percentage = getActivityPercentage(activity, day?.activities);

  if (!day) return null;

  const inactiveWithCount = activity.status !== 'active' && activity.count;

  return (
    <div
      style={{
        opacity: inactiveWithCount ? 0.4 : 1,
        pointerEvents: inactiveWithCount ? 'none' : 'initial',
      }}
      className={`${styles.wrapper}  ${activity.penalty ? styles.penalty : ''}`}
      onClick={() =>
        mutate({
          id: day._id,
          activityId: activity._id,
          value: activity.countMode === 'times' ? 1 : 10,
        })
      }
    >
      <div className={styles.content}>
        <div className={styles['icon-wrapper']}>
          <div className={styles.icon}>
            {percentage !== undefined && (
              <ActivityProgress
                percentage={percentage}
                penalty={activity.penalty}
              />
            )}
            <FontAwesomeIcon icon={activity.icon as IconName} />
          </div>
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
