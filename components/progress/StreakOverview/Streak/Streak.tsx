// Components==============
import React, { useContext } from 'react';
import { endOfDay, format, startOfDay } from 'date-fns';
import HardShadow from 'global_components/HardShadow/HardShadow';
import { motion } from 'framer-motion';
import { ProgressContext } from 'pages/progress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faFlame } from '@fortawesome/pro-solid-svg-icons';
import styles from './Streak.module.scss';
import { StreakEntity } from '../StreakOverview';
// =========================

export default function Streak({
  streak,
  maxCount,
  countType,
}: {
  streak: StreakEntity;
  maxCount: number;
  countType: 'Streaks' | 'Days';
}) {
  const { setRange, range, setMonth } = useContext(ProgressContext);

  const percentage = Math.max(
    ((countType === 'Streaks' ? streak.totalStreaks : streak.totalDays) /
      maxCount) *
      100 +
      // 0.5 is added to prevent a double right border at 100%
      0.5,
    // minimum width of 10% to prevent cramped count
    10
  );

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
          onClick={() => {
            setRange({
              from: startOfDay(streak.startDate),
              to: endOfDay(streak.endDate),
            });

            setMonth(streak.startDate);
          }}
        >
          <motion.div
            className={styles.progress}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
          >
            <p className={styles.streak}>
              <FontAwesomeIcon
                icon={countType === 'Streaks' ? faFlame : faCalendarAlt}
              />{' '}
              {countType === 'Streaks' ? streak.totalStreaks : streak.totalDays}
            </p>
          </motion.div>
        </div>
      </HardShadow>
    </div>
  );
}
