// Components==============
import { IconName } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import HardShadow from 'global_components/HardShadow/HardShadow';
import { useMediaQ } from 'hooks/useMediaQ';
import React, { useEffect, useRef, useState } from 'react';
import { framerFade } from 'utils/framerAnimations';
import { getActivityCount } from 'utils/getActivityCount';
import styles from './Column.module.scss';
// =========================

export default function Column({
  activity,
  activities,
  maxHeight,
}: {
  activity: ActivityEntity;
  activities: ActivityEntity[];
  maxHeight: number;
}) {
  const [displayPercentage, setDisplayPercentage] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);

  const columnRef = useRef<HTMLDivElement>(null);

  const query = useMediaQ('min', 525);
  const columnHeight = 19;

  const total =
    activities.map((a) => a?.count || 0).reduce((prev, cur) => prev + cur, 0) ||
    0;

  const highestCount = Math.max(...activities.map((a) => a?.count || 0)) || 0;

  const renderPercentage = (100 / highestCount) * activity.count || 0;
  const percentage = Math.round((100 / total) * activity.count) || 0;

  const calcHeight = (maxHeight / 100) * renderPercentage;
  const height = calcHeight < 20 ? columnHeight : calcHeight;

  useEffect(() => {
    if (columnRef.current?.clientWidth)
      setMaxWidth(columnRef.current.clientWidth);
  }, [columnRef.current?.clientWidth]);

  const value = displayPercentage
    ? `${percentage}%`
    : !activity.count
      ? '-'
      : getActivityCount(activity);

  return (
    <div
      className={`${styles.wrapper} ${activity.penalty ? styles.penalty : ''}`}
    >
      <HardShadow stretch>
        <motion.div
          className={styles.graph}
          animate={{ height }}
          initial={{ height: columnHeight }}
          transition={{ duration: 0.8 }}
          key={activity._id}
          ref={columnRef}
          onHoverStart={() => setDisplayPercentage(true)}
          onHoverEnd={() => setDisplayPercentage(false)}
        >
          <div className={styles.top}>{value}</div>
          {query && (
            <AnimatePresence>
              {calcHeight > 50 && (
                <motion.div
                  className={styles.icon}
                  {...framerFade}
                  exit={{ opacity: 0, transition: { duration: 0.4, delay: 0 } }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <FontAwesomeIcon icon={activity.icon as IconName} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </HardShadow>
      {query ? (
        <p className={styles.name} style={{ maxWidth }}>
          {activity.name}
        </p>
      ) : (
        <div className={`${styles['mobile-icon']} ${styles.icon}`}>
          <FontAwesomeIcon icon={activity.icon as IconName} />
        </div>
      )}
    </div>
  );
}
