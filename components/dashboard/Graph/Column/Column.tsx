// Components==============
import { IconName } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import HardShadow from 'global_components/HardShadow/HardShadow';
import React, { useRef } from 'react';
import { framerFade } from 'utils/framerAnimations';
import styles from './Column.module.scss';
// =========================

export default function Column({
  activity,
  activities,
}: {
  activity: ActivityEntity;
  activities: ActivityEntity[];
}) {
  const columnRef = useRef<HTMLDivElement>(null);

  const total =
    activities.map((a) => a?.count || 0).reduce((prev, cur) => prev + cur, 0) ||
    0;

  const highestCount = Math.max(...activities.map((a) => a?.count || 0)) || 0;

  const maxHeight = 229;
  const renderPercentage = (100 / highestCount) * activity.count || 0;
  const percentage = Math.round((100 / total) * activity.count) || 0;

  const calcHeight = (maxHeight / 100) * renderPercentage;
  const height = calcHeight < 20 ? 19 : calcHeight;

  return (
    <div
      className={`${styles.wrapper} ${activity.penalty ? styles.penalty : ''}`}
    >
      <HardShadow stretch>
        <motion.div
          className={styles.graph}
          animate={{ height }}
          initial={{ height: 19 }}
          transition={{ duration: 0.8 }}
          key={activity._id}
          ref={columnRef}
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
      <p style={{ maxWidth: columnRef.current?.clientWidth }}>
        {activity.name}
      </p>
    </div>
  );
}
