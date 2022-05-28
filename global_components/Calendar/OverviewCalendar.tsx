// Components==============
import useGetDays from 'actions/day/useGetDays';
import { DesktopOverviewContext } from 'components/overview/DesktopOverview/DesktopOverview';
import { add, endOfMonth, startOfMonth } from 'date-fns';
import React, { useContext } from 'react';
import { DayPicker } from 'react-day-picker';
import { setDateTime } from 'utils/setDateTime';
import styles from './OverviewCalendar.module.scss';
// =========================

// equals to 20-01-1999
export const timestamp = 916830000000;

export default function OverviewCalendar() {
  const { activeDay, setActiveDay, setRange, range } = useContext(
    DesktopOverviewContext
  );

  const handleMonthChange = (month: Date) => {
    const middleOfFirstDay = add(month, { hours: 12 });
    setActiveDay(middleOfFirstDay);
  };

  const start = startOfMonth(activeDay);
  const end = endOfMonth(activeDay);

  const { data: days } = useGetDays(start, end);

  const trackedDays =
    days?.map((d) => setDateTime(new Date(d.createdAt), 'middle')) || [];

  const someTimeAgo = new Date(timestamp);

  const allTimeActive = range[0].getTime() === timestamp;

  return (
    <div className={styles.wrapper}>
      <DayPicker
        toDate={new Date()}
        mode="default"
        defaultMonth={activeDay}
        weekStartsOn={1}
        modifiers={{ trackedDays }}
        modifiersClassNames={{ trackedDays: 'rdp-tracked_day' }}
        onMonthChange={handleMonthChange}
      />
      <div
        className={`${styles['all-time']} ${
          allTimeActive ? styles.active : ''
        }`}
        onClick={() => {
          if (allTimeActive) return setRange([start, end]);
          setRange([someTimeAgo, new Date()]);
        }}
      >
        All time
      </div>
    </div>
  );
}
