/* eslint-disable no-continue */
// Components==============
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faFlame,
  faSort,
} from '@fortawesome/pro-solid-svg-icons';
import useGetProgressDays from 'actions/day/useGetProgressDays';
import useGetUser from 'actions/user/useGetUser';
import { getStreakDays } from 'utils/validateStreaks/getStreakDays';
import { getDayAchievements } from 'utils/getDayAchievements';
import { ProgressContext } from 'pages/progress';
import { useMediaQ } from 'hooks/useMediaQ';
import { differenceInDays } from 'date-fns';
import { setDateTime } from 'utils/setDateTime';
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
  const [sort, setSort] = useState<'Highest' | 'Most recent'>('Highest');
  const [countType, setCountType] = useState<'Streaks' | 'Days'>('Streaks');

  const [streakEntities, setStreakEntities] = useState<StreakEntity[]>([]);
  const [showAll, setShowAll] = useState(false);

  const query = useMediaQ('min', 768);
  const limit = query ? 9 : 3;

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
      const totalDays =
        differenceInDays(
          setDateTime(endDate, 'middle'),
          setDateTime(startDate, 'middle')
        ) + 1;
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

  const maxCount = useMemo(
    () =>
      Math.max(
        ...streakEntities.map((s) =>
          countType === 'Streaks' ? s.totalStreaks : s.totalDays
        )
      ),
    [streakEntities, countType]
  );

  const sortedAndFilteredStreaks = useMemo(
    () =>
      streakEntities
        .sort((a, b) => {
          if (sort === 'Highest')
            return countType === 'Days'
              ? b.totalDays - a.totalDays
              : b.totalStreaks - a.totalStreaks;
          return b.startDate.getTime() - a.startDate.getTime();
        })
        .filter((s) => {
          const startedInRange =
            s.startDate >= range.from && s.startDate <= range.to;
          const endedInRange = s.endDate >= range.from && s.endDate <= range.to;
          const startedBeforeRange =
            s.startDate < range.from && s.endDate >= range.from;
          const endedAfterRange =
            s.startDate <= range.to && s.endDate > range.to;
          return (
            startedInRange ||
            endedInRange ||
            startedBeforeRange ||
            endedAfterRange
          );
        }),
    [streakEntities, range, sort, countType]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div>
          <p className={styles.title}>
            Streak{sortedAndFilteredStreaks.length > 1 ? 's' : ''}
          </p>
        </div>
        <div
          className={styles.sort}
          onClick={() =>
            setCountType(countType === 'Streaks' ? 'Days' : 'Streaks')
          }
        >
          <FontAwesomeIcon
            icon={countType === 'Streaks' ? faFlame : faCalendarAlt}
          />{' '}
          {countType}
        </div>
        <div className={styles.divider} />
        <div
          className={styles.sort}
          onClick={() =>
            setSort(sort === 'Highest' ? 'Most recent' : 'Highest')
          }
        >
          <FontAwesomeIcon icon={faSort} /> {sort}
        </div>
      </div>
      <div className={styles.streaks}>
        {sortedAndFilteredStreaks
          .filter((_, i) => (showAll ? true : i < limit))
          .map((streak, i) => (
            <Streak
              key={i}
              streak={streak}
              maxCount={maxCount}
              countType={countType}
            />
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
