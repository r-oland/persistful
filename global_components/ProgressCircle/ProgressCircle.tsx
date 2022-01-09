// Components==============
import { faBullseye } from '@fortawesome/pro-regular-svg-icons';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetDay from 'actions/day/useGetDay';
import useGetUser from 'actions/user/useGetUser';
import { useCounter } from 'hooks/useCounter';
import React from 'react';
import { converMinutesToHours } from 'utils/convertMinutesToHours';
import { getAchievedStreaks } from 'utils/getAchievedStreaks';
import { getActivitySum } from 'utils/getActivitySum';
import styles from './ProgressCircle.module.scss';
// =========================

export default function ProgressCircle() {
  const { data: user } = useGetUser();
  const { data: day } = useGetDay(new Date());

  const persistfulSum = getActivitySum(
    day?.activities?.filter((a) => !a.penalty)
  );
  const penaltySum = getActivitySum(day?.activities?.filter((a) => a.penalty));
  const totalSum = Math.floor(persistfulSum - penaltySum);
  const valueTo = !day ? undefined : totalSum;
  const counter = useCounter({ valueTo });

  const streak = getAchievedStreaks(day, user);

  return (
    <div className={styles.wrapper}>
      <h1>{converMinutesToHours(counter)}</h1>
      <p>
        <FontAwesomeIcon icon={faFlame} /> {(user?.streak || 0) + streak}
      </p>
      <p>
        <FontAwesomeIcon icon={faBullseye} />
        {converMinutesToHours(user?.rules.dailyGoal || 0)}
      </p>
    </div>
  );
}
