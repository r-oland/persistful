// Components==============
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { framerFade } from 'utils/framerAnimations';
import styles from './Circles.module.scss';
// =========================

function Circle({
  percentage,
  index,
  bonus,
  phantom,
}: {
  percentage: number;
  index: number;
  bonus?: boolean;
  phantom?: boolean;
}) {
  const strokeWidth = index === 0 ? 5 : index === 1 ? 6.5 : 8.5;
  const radius = 45;
  const circumference = Math.ceil(2 * Math.PI * radius);
  const fillPercentage = Math.abs(
    Math.ceil((circumference / 100) * (percentage - 100))
  );
  const duration = 0.8;

  // only have delay on mount
  const [delay, setDelay] = useState(index * 0.15);
  useEffect(() => {
    // prevent delay from being set to 0 while animating
    const timeout = setTimeout(() => setDelay(0), duration * 1000);
    return () => clearTimeout(timeout);
  }, []);

  const transition = {
    duration,
    delay,
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
      className={`${styles.wrapper} ${
        index === 0
          ? styles.outer
          : index === 1
            ? styles.middle
            : index === 2
              ? styles.inner
              : ''
      }`}
    >
      {!bonus && (
        <>
          <AnimatePresence>
            {(index === 0 || percentage > 0) && (
              <svg viewBox="0 0 100 100" className={styles.background}>
                <motion.circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="circle"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="transparent"
                  {...framerFade}
                />
              </svg>
            )}
          </AnimatePresence>
          <svg viewBox="0 0 100 100" className={styles.shadow}>
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
        </>
      )}
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
      <svg
        viewBox="0 0 100 100"
        className={`${styles.progress} ${bonus ? styles.bonus : ''} ${
          phantom ? styles.phantom : ''
        }`}
      >
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth={
            strokeWidth - (index === 0 ? 0.8 : index === 1 ? 1 : 1.2)
          }
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
    </div>
  );
}

export default function Circles({
  progress,
  bonus,
  phantom,
}: {
  progress: number[];
  bonus?: boolean;
  phantom?: boolean;
}) {
  return (
    <>
      {progress.map((percentage, i) => (
        <Circle
          percentage={percentage}
          index={i}
          key={i}
          bonus={bonus}
          phantom={phantom}
        />
      ))}
    </>
  );
}
