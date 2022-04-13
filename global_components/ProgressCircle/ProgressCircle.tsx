// Components==============
import { faBullseye } from '@fortawesome/pro-regular-svg-icons';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetDay from 'actions/day/useGetDay';
import useGetUser from 'actions/user/useGetUser';
import { useCounter } from 'hooks/useCounter';
import { DashboardContext } from 'pages';
import React, { useContext } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getProgress } from 'utils/getProgress';
import Circles from './Circles/Circles';
import styles from './ProgressCircle.module.scss';
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

export default function ProgressCircle() {
  const { data: user } = useGetUser();

  const { activeDay } = useContext(DashboardContext);
  const { data: day } = useGetDay(activeDay);

  if (!day) return null;

  const { total, bonusScore, streak } = getDayAchievements(day, true);

  const flatStreak = Math.floor(streak);

  // Calculate percentage of bonus time over daily goal
  const todayBonusTime = day?.rules.prm
    ? bonusScore / (day?.rules.dailyGoal || 0)
    : 0;

  const progress = getProgress(streak);
  const bonusProgress = getProgress(todayBonusTime);

  const todayStamp = new Date().toLocaleDateString();
  const activeDayStamp = activeDay.toLocaleDateString();

  const displayStreak =
    // if active day is today
    todayStamp === activeDayStamp
      ? // grab calculated total streak from user && add daily streak
        (user?.streak || 0) + flatStreak
      : // grab streak directly from day since it's invalidated on each update
        flatStreak;

  return (
    <div className={styles.wrapper}>
      <Circles progress={progress} />
      <Circles progress={bonusProgress} bonus />
      <div className={styles.center}>
        <CounterTitle valueTo={total} streak={streak} />
        <div className={styles.bottom}>
          <div className={styles.streak}>
            <FontAwesomeIcon icon={faFlame} /> <p>{displayStreak}</p>
          </div>
          <div className={styles.goal}>
            <FontAwesomeIcon icon={faBullseye} />{' '}
            <p>{convertMinutesToHours(day?.rules.dailyGoal || 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
