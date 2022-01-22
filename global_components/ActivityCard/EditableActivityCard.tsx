// Components==============
import { IconName } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetDay from 'actions/day/useGetDay';
import { useMediaQ } from 'hooks/useMediaQ';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { useEffect, useRef, useState } from 'react';
import { getActivityCount } from 'utils/getActivityCount';
import { getActivityPercentage } from 'utils/getActivityPercentage';
import styles from './ActivityCard.module.scss';
import ActivityProgress from './ActivityProgress/ActivityProgress';
import Overlay from './Overlay/Overlay';
// =========================

export default function EditableActivityCard({
  activity,
}: {
  activity: ActivityEntity;
}) {
  const { data: day } = useGetDay(new Date());
  const [displayOverlay, setDisplayOverlay] = useState(false);

  const query = useMediaQ('min', 525);

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside({
    refs: [ref],
    handler: () => setDisplayOverlay(false),
    condition: displayOverlay,
  });

  // reset overlay values on open
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (displayOverlay) setKey((prev) => prev + 1);
  }, [displayOverlay]);
  //

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
      onClick={() => setDisplayOverlay(true)}
      ref={ref}
    >
      {!query && <div className={styles['mobile-bar']} />}
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
      {query && <div className={styles.bar} />}
      <Overlay
        show={displayOverlay}
        hide={(e) => {
          e.stopPropagation();
          setDisplayOverlay(false);
        }}
        activity={activity}
        percentage={percentage}
        day={day}
        key={key}
      />
    </div>
  );
}
