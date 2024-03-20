// Components==============
import React, { useContext } from 'react';
import { ProgressContext } from 'pages/progress';
import {
  subYears,
  subMonths,
  subWeeks,
  startOfToday,
  endOfToday,
  startOfDay,
} from 'date-fns';
import useGetProgressDays from 'actions/day/useGetProgressDays';
import styles from './QuickDateSelect.module.scss';
// =========================

export default function QuickDateSelect({
  callback,
}: {
  callback?: () => void;
}) {
  const { setRange, range, setMonth } = useContext(ProgressContext);
  const { data: days } = useGetProgressDays({ allDays: true });

  const buttons = [
    {
      name: 'last week' as const,
      range: { from: subWeeks(startOfToday(), 1), to: endOfToday() },
    },
    {
      name: 'last month' as const,
      range: { from: subMonths(startOfToday(), 1), to: endOfToday() },
    },
    {
      name: 'last year' as const,
      range: { from: subYears(startOfToday(), 1), to: endOfToday() },
    },
    {
      name: 'all time' as const,
      range: {
        from: startOfDay(new Date(days ? days[0].createdAt : 0)),
        to: endOfToday(),
      },
    },
  ];

  return (
    <div className={styles.wrapper}>
      {buttons.map((button) => (
        <div
          key={button.name}
          className={`${styles.button} ${
            range.from.getTime() === button.range.from.getTime() &&
            range.to.getTime() === button.range.to.getTime()
              ? styles.selected
              : ''
          }`}
          onClick={() => {
            setRange(button.range);
            setMonth(new Date());
            if (callback) callback();
          }}
        >
          {button.name}
        </div>
      ))}
    </div>
  );
}
