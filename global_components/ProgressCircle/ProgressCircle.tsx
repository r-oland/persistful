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
import { ProgressCircleTypes, useDayData } from './useDayData';
import { useRangeData } from './useRangeData';
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

function DisplayComponent({
  displayData,
}: {
  displayData: ProgressCircleTypes;
}) {
  return (
    <div className={styles.wrapper}>
      <Circles progress={displayData.progress} />
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

function DayComponent({ activeDay }: { activeDay: Date }) {
  const displayData = useDayData(activeDay);

  return <DisplayComponent displayData={displayData} />;
}

function RangeComponent({
  days,
  isLoading,
}: {
  days?: DayEntity[];
  isLoading?: boolean;
}) {
  const displayData = useRangeData(days, isLoading);

  return <DisplayComponent displayData={displayData} />;
}

export default function ProgressCircle({
  activeDay,
  days,
  isLoading,
}: {
  activeDay?: Date;
  days?: DayEntity[];
  isLoading?: boolean;
}) {
  if (activeDay) return <DayComponent activeDay={activeDay} />;

  // overview
  return <RangeComponent days={days} isLoading={isLoading} />;
}
