// Components==============
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-solid-svg-icons';
import styles from './ActivityLineGraph.module.scss';
import ActivityCircles from './ActivityCircles/ActivityCircles';
import LineGraph from './LineGraph/LineGraph';
// =========================

export default function ActivityLineGraph() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <p className={styles.title}>Activities</p>
        <p className={styles['day-selector']}>
          <FontAwesomeIcon icon={faEye} /> All days
        </p>
      </div>
      <div className={styles.content}>
        <ActivityCircles />
        <div className={styles.bar} />
        <LineGraph />
      </div>
    </div>
  );
}
