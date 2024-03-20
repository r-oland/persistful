// Components==============
import React, { useContext } from 'react';
import { endOfDay, format, startOfDay } from 'date-fns';
import HardShadow from 'global_components/HardShadow/HardShadow';
import { motion } from 'framer-motion';
import { ProgressContext } from 'pages/progress';
import styles from './Streak.module.scss';
import { StreakEntity } from '../StreakOverview';
// =========================

export default function Streak({
  streak,
  maxStreak,
}: {
  streak: StreakEntity;
  maxStreak: number;
}) {
  const { setRange, range } = useContext(ProgressContext);

  const percentage = (streak.totalStreaks / maxStreak) * 100;

  const sameAsRange =
    range.from.toLocaleDateString() === streak.startDate.toLocaleDateString() &&
    range.to.toLocaleDateString() === streak.endDate.toLocaleDateString();

  return (
    <div className={styles.wrapper}>
      <div className={styles.dates}>
        <p className={styles.date}>{format(streak.startDate, 'dd MMM yyyy')}</p>
        <p className={styles.date}>{format(streak.endDate, 'dd MMM yyyy')}</p>
      </div>
      <HardShadow stretch animations={!sameAsRange}>
        <div
          className={styles.bar}
          onClick={() =>
            setRange({
              from: startOfDay(streak.startDate),
              to: endOfDay(streak.endDate),
            })
          }
        >
          <motion.div
            className={styles.progress}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
          />
        </div>
      </HardShadow>
    </div>
  );
}
