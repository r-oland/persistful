// Components==============
import useGetUser from 'actions/user/useGetUser';
import { add } from 'date-fns';
import { DashboardContext } from 'pages';
import React, { useContext } from 'react';
import { DayPicker } from 'react-day-picker';
import styles from './Calendar.module.scss';
// =========================

export default function Calendar() {
  const { activeDay, setActiveDay } = useContext(DashboardContext);

  const { data: user } = useGetUser();

  const handleDayClick = (day: Date) => {
    const middleOfDay = add(day, { hours: 12 });
    setActiveDay(middleOfDay);
  };

  const modifiers = user?.lastSecondChance
    ? { secondChance: [new Date(user?.lastSecondChance)] }
    : undefined;

  return (
    <div className={styles.wrapper}>
      <DayPicker
        selected={activeDay}
        onDayClick={handleDayClick}
        required
        toDate={new Date()}
        mode="single"
        defaultMonth={activeDay}
        weekStartsOn={1}
        modifiers={modifiers}
        modifiersClassNames={{ secondChance: 'rdp-second_chance' }}
      />
    </div>
  );
}
