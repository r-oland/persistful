/* eslint-disable no-continue */
// Components==============
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/pro-solid-svg-icons';
import useGetProgressDays from 'actions/day/useGetProgressDays';
import useGetUser from 'actions/user/useGetUser';
import { getStreakDays } from 'utils/validateStreaks/getStreakDays';
import { getDayAchievements } from 'utils/getDayAchievements';
import { ProgressContext } from 'pages/progress';
import { useMediaQ } from 'hooks/useMediaQ';
import styles from './StreakOverview.module.scss';
import Streak from './Streak/Streak';
// =========================

export type StreakEntity = {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalStreaks: number;
};

export default function StreakOverview() {
  const [sort, setSort] = useState<'Highest streak' | 'Most recent'>(
    'Highest streak'
  );

  const [streakEntities, setStreakEntities] = useState<StreakEntity[]>([]);
  const [showAll, setShowAll] = useState(false);

  const query = useMediaQ('min', 768);
  const limit = query ? 12 : 3;

  const { data: days } = useGetProgressDays({ allDays: true });
  const { data: user } = useGetUser();

  const { range } = useContext(ProgressContext);

  useEffect(() => {
    if (!days || !user) return;

    const streaks: StreakEntity[] = [];

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

      // If the streak is smaller then 3, move on to the next day
      // IMPORTANT NOTE: This should always check that there is at least 1 day in the streak
      if (streakDays.length < 3) {
        // Remove last day from the remaining days
        remainingDays = remainingDays.slice(1);

        continue;
      }

      // Get relevant information from the streak days
      const startDate = streakDays[streakDays.length - 1].createdAt;
      const endDate = streakDays[0].createdAt;
      const totalDays = streakDays.length;
      const totalStreaks = streakDays.reduce(
        (count, day) => count + getDayAchievements(day).streak,
        0
      );

      // Add the streak to the streaks variable
      streaks.push({ startDate, endDate, totalDays, totalStreaks });

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

  const maxStreak = useMemo(
    () => Math.max(...streakEntities.map((s) => s.totalStreaks)),
    [streakEntities]
  );

  const sortedAndFilteredStreaks = useMemo(
    () =>
      streakEntities
        .sort((a, b) => {
          if (sort === 'Highest streak') return b.totalStreaks - a.totalStreaks;
          return b.startDate.getTime() - a.startDate.getTime();
        })
        .filter((s) => range.from <= s.startDate && s.endDate <= range.to),
    [streakEntities, range, sort]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <p className={styles.title}>
          Streak{sortedAndFilteredStreaks.length > 1 ? 's' : ''}
        </p>
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
        {sortedAndFilteredStreaks
          .filter((_, i) => (showAll ? true : i < limit))
          .map((streak, i) => (
            <Streak key={i} streak={streak} maxStreak={maxStreak} />
          ))}
      </div>
      {sortedAndFilteredStreaks.length > limit && (
        <button
          type="button" // Add the type attribute with the value of "button"
          className={styles['show-more']}
          onClick={() => setShowAll((prev) => !prev)}
        >
          Show {showAll ? 'less' : 'more'}
        </button>
      )}
    </div>
  );
}
