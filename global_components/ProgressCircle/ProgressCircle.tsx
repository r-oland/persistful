// Components==============
import { faBullseye } from '@fortawesome/pro-regular-svg-icons';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetDay from 'actions/day/useGetDay';
import useGetUser from 'actions/user/useGetUser';
import { useCounter } from 'hooks/useCounter';
import { DashboardContext } from 'pages';
import React, { useContext, useEffect, useState } from 'react';
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
  const [displayData, setDisplayData] = useState({
    progress: [0, 0, 0],
    bonusProgress: [0, 0, 0],
    total: 0,
    streak: 0,
    displayStreak: 0,
    dailyGoal: '0:00',
  });

  const { data: user } = useGetUser();

  const { activeDay } = useContext(DashboardContext);
  const { data: day } = useGetDay(activeDay);

  const { total, bonusScore, streak } = getDayAchievements(day, true);

  const flatStreak = Math.floor(streak);

  // Calculate percentage of bonus time over daily goal
  const todayBonusTime = day?.rules?.prm
    ? bonusScore / (day?.rules?.dailyGoal || 0)
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

  const dailyGoal = convertMinutesToHours(day?.rules?.dailyGoal || 0);

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (day)
      setDisplayData({
        progress,
        bonusProgress,
        total,
        streak,
        displayStreak,
        dailyGoal,
      });
  }, [JSON.stringify(day)]);

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
