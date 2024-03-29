import { motion } from 'framer-motion';
import React from 'react';
import styles from './SmallProgressCircle.module.scss';

export default function SmallProgressCircle({
  percentage,
  color = 'green',
  children,
  large,
}: {
  percentage: number;
  color?: 'green' | 'red' | 'black' | 'dark-green';
  children?: React.ReactNode;
  large?: boolean;
}) {
  const strokeWidth = 6;
  const radius = 45;
  const size = large ? 90 : 65;
  const circumference = Math.ceil(2 * Math.PI * radius);
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
      className={`${styles.wrapper} ${styles[color]}`}
      style={{ width: size, height: size }}
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
      <div className={styles.content}>{children}</div>
    </div>
  );
}
