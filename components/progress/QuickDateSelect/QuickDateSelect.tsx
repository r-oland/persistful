// Components==============
import React, { useContext } from 'react';
import { ProgressContext } from 'pages/progress';
import { subYears, subMonths, subWeeks, startOfToday } from 'date-fns';
import styles from './QuickDateSelect.module.scss';
// =========================

export default function QuickDateSelect() {
  const { setRange, range } = useContext(ProgressContext);

  const buttons = [
    {
      name: 'last week' as const,
      range: [subWeeks(startOfToday(), 1), startOfToday()],
    },
    {
      name: 'last month' as const,
      range: [subMonths(startOfToday(), 1), startOfToday()],
    },
    {
      name: 'last year' as const,
      range: [subYears(startOfToday(), 1), startOfToday()],
    },
    { name: 'all time' as const, range: [new Date(0), startOfToday()] },
  ];

  return (
    <div className={styles.wrapper}>
      {buttons.map((button) => (
        <div
          key={button.name}
          className={`${styles.button} ${
            range[0].getTime() === button.range[0].getTime() &&
            range[1].getTime() === button.range[1].getTime()
              ? styles.selected
              : ''
          }`}
          onClick={() => setRange(button.range)}
        >
          {button.name}
        </div>
      ))}
    </div>
  );
}
