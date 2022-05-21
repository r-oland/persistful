// Components==============
import useGetDays from 'actions/day/useGetDays';
import React from 'react';
import { getPastDay } from 'utils/getPastDay';
import styles from './Graph.module.scss';
// =========================

export default function Graph() {
  const lines = Array.from(Array(5).keys());

  // Change it so that it is 6 days in the past. -> not 7 because today also counts
  const lastWeek = getPastDay(new Date(), 6);

  const { data: days } = useGetDays(lastWeek, new Date());

  console.log(days);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {lines.map((line) => (
          <div
            className={styles.line}
            key={line}
            style={{ top: line * (259 / (lines.length - 1)) }}
          />
        ))}
      </div>
    </div>
  );
}
