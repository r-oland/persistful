// Components==============
import { faBullseye } from '@fortawesome/pro-regular-svg-icons';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCounter } from 'hooks/useCounter';
import React from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getProgress } from 'utils/getProgress';
import Circles from './Circles/Circles';
import styles from './ProgressCircle.module.scss';
import { useDayData } from './useDayData';
// =========================

function CounterTitle({
  valueTo,
  streak,
}: {
  valueTo: number;
  streak: number;
}) {
  const progress = getProgress(streak);
  const counter = useCounter(valueTo);

  return (
    <h1 style={{ fontSize: progress[2] ? 35 : 40 }}>
      {convertMinutesToHours(counter)}
    </h1>
  );
}

export default function ProgressCircle({ activeDay }: { activeDay: Date }) {
  const displayData = useDayData(activeDay);

  return (
    <div className={styles.wrapper}>
      <Circles progress={displayData.progress} phantom={displayData.phantom} />
      <Circles progress={displayData.bonusProgress} bonus />
      <div className={styles.center}>
        <CounterTitle valueTo={displayData.total} streak={displayData.streak} />
        <div className={styles.bottom}>
          <div className={styles.streak}>
            <FontAwesomeIcon icon={faFlame} />{' '}
            <p>{displayData.displayStreak}</p>
          </div>
          <div className={styles.goal}>
            <FontAwesomeIcon icon={faBullseye} /> <p>{displayData.dailyGoal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
