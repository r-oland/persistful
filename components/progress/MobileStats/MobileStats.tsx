// Components==============
import React from 'react';
import styles from './MobileStats.module.scss';
import useGetProgressStats from './useGetProgressStats';
// =========================

export default function MobileStats() {
  const displayData = useGetProgressStats();

  const stats = [
    {
      name: 'Total time',
      data: displayData.totalTime,
    },
    {
      name: 'Average time',
      data: displayData.averageTime,
    },
    {
      name: 'Total cycles',
      data: displayData.totalCycles,
    },
    {
      name: 'Days tracked',
      data: displayData.daysTracked,
    },
  ];

  return (
    <div className={styles.wrapper}>
      {stats.map((stat, i) => (
        <React.Fragment key={i}>
          <div className={styles.stat}>
            <span>{stat.name}</span>
            <p>{stat.data}</p>
          </div>
          {i !== stats.length - 1 && <div className={styles.bar} />}
        </React.Fragment>
      ))}
    </div>
  );
}
