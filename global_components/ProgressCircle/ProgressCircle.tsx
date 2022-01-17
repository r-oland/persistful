// Components==============
import { faBullseye } from '@fortawesome/pro-regular-svg-icons';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetDay from 'actions/day/useGetDay';
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import useUpdateStreak from 'actions/reward/useUpdateStreak';
import useGetUser from 'actions/user/useGetUser';
import { useCounter } from 'hooks/useCounter';
import { usePrevious } from 'hooks/usePrevious';
import React, { useEffect } from 'react';
import { converMinutesToHours } from 'utils/convertMinutesToHours';
import { getAchievedStreaks } from 'utils/getAchievedStreaks';
import { getActivitySum } from 'utils/getActivitySum';
import { getProgress } from 'utils/getProgress';
import Circles from './Circles/Circles';
import styles from './ProgressCircle.module.scss';
// =========================

export default function ProgressCircle() {
  const { data: user } = useGetUser();
  const { data: day } = useGetDay(new Date());
  const { data: activeReward } = useGetActiveReward();
  const updateRewardStreak = useUpdateStreak();

  const persistfulSum = getActivitySum(
    day?.activities?.filter((a) => !a.penalty)
  );
  const penaltySum = getActivitySum(day?.activities?.filter((a) => a.penalty));
  const totalSum = Math.floor(persistfulSum - penaltySum);
  const valueTo = !day ? undefined : totalSum;
  const counter = useCounter({ valueTo });

  const streak = getAchievedStreaks(day, user, true);
  const flatStreak = Math.floor(streak);
  const progress = getProgress(streak);
  const previousStreak = usePrevious(flatStreak);

  // update active reward streak if streak changes
  useEffect(() => {
    if (!activeReward) return;

    // if previousStreak doesn't exists, let it resolve to current streak for an outcome of 0
    const previousValue =
      previousStreak === undefined ? flatStreak : previousStreak;

    const difference = flatStreak - previousValue;

    // Difference can be 0 on mount & with HMR
    if (difference !== 0)
      updateRewardStreak.mutate({ id: activeReward._id, difference });
  }, [flatStreak]);

  return (
    <div className={styles.wrapper}>
      <Circles progress={progress} />
      <div className={styles.center}>
        <h1 style={{ fontSize: progress[2] ? 35 : 40 }}>
          {converMinutesToHours(counter)}
        </h1>
        <div className={styles.bottom}>
          <div className={styles.streak}>
            <FontAwesomeIcon icon={faFlame} />{' '}
            <p>{(user?.streak || 0) + flatStreak}</p>
          </div>
          <div className={styles.goal}>
            <FontAwesomeIcon icon={faBullseye} />{' '}
            <p>{converMinutesToHours(user?.rules.dailyGoal || 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
