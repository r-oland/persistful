/* eslint-disable no-continue */
// Components==============
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/pro-solid-svg-icons';
import useGetProgressDays from 'actions/day/useGetProgressDays';
import useGetUser from 'actions/user/useGetUser';
import { getStreakDays } from 'utils/validateStreaks/getStreakDays';
import { format } from 'date-fns';
import { getDayAchievements } from 'utils/getDayAchievements';
import styles from './StreakOverview.module.scss';
// =========================

export default function StreakOverview() {
  const [sort, setSort] = useState<'Highest streak' | 'Most recent'>(
    'Highest streak'
  );

  const [clickedStreaks, setClickedStreaks] = useState<number[]>([]);

  const [streakEntities, setStreakEntities] = useState<DayEntity[][]>([[]]);

  const { data: days } = useGetProgressDays({ allDays: true });
  const { data: user } = useGetUser();

  useEffect(() => {
    if (!days || !user) return;

    const streaks: DayEntity[][] = [];

    const sortedDays = days!
      .map((d) => ({ ...d, createdAt: new Date(d.createdAt) }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    let remainingDays = [...sortedDays];

    while (remainingDays.length > 0) {
      const firstDayInStreak = remainingDays[0];

      // Check if the first day in the streak is an actual streak day
      if (!getDayAchievements(firstDayInStreak).streak) {
        // Remove last day from the remaining days
        remainingDays = remainingDays.slice(1);

        continue;
      }

      const { streakDays } = getStreakDays({
        days: remainingDays,
        user: user!,
      });

      // If there's no streak accomplished, move on to the next day
      if (streakDays.length === 0) {
        // Remove last day from the remaining days
        remainingDays = remainingDays.slice(1);

        continue;
      }

      streaks.push(streakDays);

      // Set the new remaining days to the days that are not in the streak variable
      remainingDays = remainingDays.filter(
        (d) =>
          d.createdAt.getTime() <
          // Last day in the streak variable
          streakDays[streakDays.length - 1].createdAt.getTime()
      );
    }

    setStreakEntities(streaks);
  }, [days, user]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <p className={styles.title}>Streaks</p>
        <div
          className={styles.sort}
          onClick={() =>
            setSort(
              sort === 'Highest streak' ? 'Most recent' : 'Highest streak'
            )
          }
        >
          <FontAwesomeIcon icon={faSort} /> {sort}
        </div>
      </div>
      <div className={styles.streaks}>
        {streakEntities.map((streak, i) => (
          <div
            key={i}
            className={styles.streak}
            style={{
              backgroundColor: clickedStreaks.includes(i) ? '#18e597' : 'white',
            }}
            onClick={() => {
              if (clickedStreaks.includes(i)) {
                setClickedStreaks(
                  clickedStreaks.filter((index) => index !== i)
                );
              } else {
                setClickedStreaks([...clickedStreaks, i]);
              }
            }}
          >
            <p>
              {streak?.[0]
                ? `${format(streak[0].createdAt, 'dd MMM yyyy')}`
                : 'N/a'}{' '}
              -{' '}
              {streak?.[streak.length - 1]
                ? `${format(streak[streak.length - 1].createdAt, 'dd MMM yyyy')}`
                : 'N/a'}{' '}
              : <b>{streak.length} days</b>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
