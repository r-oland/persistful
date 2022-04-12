// Components==============
import { faBullseye } from '@fortawesome/pro-regular-svg-icons';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetDay from 'actions/day/useGetDay';
import useGetUser from 'actions/user/useGetUser';
import { GlobalTodayStreakContext } from 'global_components/GlobalTodayStreakContextWrapper';
import { useCounter } from 'hooks/useCounter';
import React, { useContext } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getProgress } from 'utils/getProgress';
import Circles from './Circles/Circles';
import styles from './ProgressCircle.module.scss';
// =========================

function CounterTitle({ valueTo }: { valueTo: number }) {
  const { todayStreak } = useContext(GlobalTodayStreakContext);
  const progress = getProgress(todayStreak);
  const counter = useCounter(valueTo);

  return (
    <h1 style={{ fontSize: progress[2] ? 35 : 40 }}>
      {convertMinutesToHours(counter)}
    </h1>
  );
}

export default function ProgressCircle() {
  const { data: user } = useGetUser();
  const { data: day } = useGetDay(new Date());

  const { todayStreak, flatTodayStreak } = useContext(GlobalTodayStreakContext);

  const { total, bonusScore } = getDayAchievements(day);

  const valueTo = !day ? undefined : total;

  // Calculate percentage of bonus time over daily goal
  const todayBonusTime = day?.rules.prm
    ? bonusScore / (day?.rules.dailyGoal || 0)
    : 0;

  const progress = getProgress(todayStreak);
  const bonusProgress = getProgress(todayBonusTime);

  return (
    <div className={styles.wrapper}>
      <Circles progress={progress} />
      <Circles progress={bonusProgress} bonus />
      <div className={styles.center}>
        {valueTo !== undefined && <CounterTitle valueTo={valueTo} />}
        <div className={styles.bottom}>
          <div className={styles.streak}>
            <FontAwesomeIcon icon={faFlame} />{' '}
            <p>{(user?.streak || 0) + flatTodayStreak}</p>
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
