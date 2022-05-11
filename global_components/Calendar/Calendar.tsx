// Components==============
import { DashboardContext } from 'pages';
import React, { useContext } from 'react';
import { DayPicker } from 'react-day-picker';
import styles from './Calendar.module.scss';
// =========================

export default function Calendar() {
  const { activeDay, setActiveDay } = useContext(DashboardContext);

  return (
    <div className={styles.wrapper}>
      <DayPicker
        selected={activeDay}
        onSelect={setActiveDay}
        toDate={new Date()}
        mode="single"
        weekStartsOn={1}
      />
    </div>
  );
}
