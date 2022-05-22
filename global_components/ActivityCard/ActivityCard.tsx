// Components==============
import { IconName } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HardShadow from 'global_components/HardShadow/HardShadow';
import { useMediaQ } from 'hooks/useMediaQ';
import React from 'react';
import { getActivityCount } from 'utils/getActivityCount';
import { getActivityPercentage } from 'utils/getActivityPercentage';
import styles from './ActivityCard.module.scss';
import ActivityProgress from './ActivityProgress/ActivityProgress';
import EditableActivityCard from './EditableActivityCard';
import Pattern from './Pattern/Pattern';
// =========================

export default function ActivityCard({
  activity,
  canEdit,
  onClick,
  selected,
  disableAnimations,
  activities,
}: {
  activity: ActivityEntity;
  canEdit?: boolean;
  onClick?: () => void;
  selected?: boolean;
  disableAnimations?: boolean;
  activities?: ActivityEntity[];
}) {
  const query = useMediaQ('min', 525);

  if (canEdit) return <EditableActivityCard activity={activity} />;

  const percentage = getActivityPercentage(activity, activities);

  return (
    <div
      style={{
        opacity: activity.status === 'inactive' ? 0.4 : 1,
      }}
    >
      <HardShadow animations={!disableAnimations} stretch>
        <div
          className={`${styles.wrapper}  ${
            activity.penalty ? styles.penalty : ''
          } ${selected ? styles.selected : ''}`}
          onClick={onClick}
        >
          {!query && <div className={styles['mobile-bar']} />}
          <div className={styles.content}>
            <div className={styles['icon-wrapper']}>
              {percentage !== undefined && (
                <ActivityProgress
                  percentage={percentage}
                  penalty={activity.penalty}
                />
              )}
              <div className={styles.icon}>
                <FontAwesomeIcon icon={activity.icon as IconName} />
              </div>
            </div>
            <div className={styles.info}>
              <p>{activity.name}</p>
              <h3>{getActivityCount(activity)}</h3>
            </div>
            {!!activity.pattern && (
              <Pattern
                isPenalty={!!activity.penalty}
                pattern={activity.pattern}
              />
            )}
          </div>
          {query && <div className={styles.bar} />}
          <div className={styles.bar} />
        </div>
      </HardShadow>
    </div>
  );
}
