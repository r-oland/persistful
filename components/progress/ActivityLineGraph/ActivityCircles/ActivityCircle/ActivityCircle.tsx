import { motion } from 'framer-motion';
import React from 'react';
import { getActivityCount } from 'utils/getActivityCount';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from './ActivityCircle.module.scss';

export default function ActivityCircle({
  activity,
  totalCount,
}: {
  activity: ActivityEntity;
  totalCount: number;
}) {
  const strokeWidth = 5;
  const radius = 45;
  const circumference = Math.ceil(2 * Math.PI * radius);
  const percentage = (100 / totalCount) * activity.count;
  const fillPercentage = Math.abs(
    Math.ceil((circumference / 100) * (percentage - 100))
  );

  const transition = {
    duration: 0.8,
  };

  const variants = {
    hidden: {
      strokeDashoffset: circumference,
      transition,
    },
    show: {
      strokeDashoffset: fillPercentage,
      transition,
    },
  };

  return (
    <div
      className={`${styles.wrapper} ${activity.penalty ? styles.penalty : ''}`}
    >
      <svg viewBox="0 0 100 100" className={styles.background}>
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="circle"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
        />
      </svg>
      <svg viewBox="0 0 100 100" className={styles.stroke}>
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDashoffset={fillPercentage}
          strokeDasharray={circumference}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={variants}
          initial="hidden"
          animate="show"
        />
      </svg>
      <div className={styles.content}>
        <p>{getActivityCount(activity)}</p>
        <span className={styles.icon}>
          <FontAwesomeIcon icon={activity.icon as IconProp} />
        </span>
      </div>
    </div>
  );
}
