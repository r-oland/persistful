// Components==============
import { IconName } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HardShadow from 'global_components/HardShadow/HardShadow';
import React from 'react';
import { getActivityCount } from 'utils/getActivityCount';
import styles from './ActivityCard.module.scss';
import EditableActivityCard from './EditableActivityCard';
// =========================

export default function ActivityCard({
  activity,
  canEdit,
  onClick,
  selected,
}: {
  activity: ActivityEntity;
  canEdit?: boolean;
  onClick?: () => void;
  selected?: boolean;
}) {
  if (canEdit) return <EditableActivityCard activity={activity} />;

  return (
    <HardShadow animations stretch>
      <div
        className={`${styles.wrapper}  ${
          activity.penalty ? styles.penalty : ''
        } ${selected ? styles.selected : ''}`}
        onClick={onClick}
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
    </HardShadow>
  );
}