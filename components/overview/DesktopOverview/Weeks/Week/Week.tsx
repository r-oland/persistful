// Components==============
import React from 'react';
import styles from './Week.module.scss';
// =========================

export default function Week({ week }: { week: DayEntity[] }) {
  return (
    <div className={styles.wrapper}>
      {week.map((day) => (
        <div key={day._id}>{day.createdAt}</div>
      ))}
    </div>
  );
}
