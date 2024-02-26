// Components==============
import useGetUser from 'actions/user/useGetUser';
import { add, addDays, differenceInDays } from 'date-fns';
import React from 'react';
import { DayPicker } from 'react-day-picker';
import { setDateTime } from 'utils/setDateTime';
// =========================

export default function Calendar({
  activeDay,
  setActiveDay,
  toDate = new Date(),
  fromDate,
}: {
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
  toDate?: Date;
  fromDate?: Date;
}) {
  const { data: user } = useGetUser();

  const handleDayClick = (day: Date) => {
    const middleOfDay = add(day, { hours: 12 });
    setActiveDay(middleOfDay);
  };

  const streak = user?.startDateGeneralStreak
    ? Array.from(
        Array(
          differenceInDays(
            setDateTime(new Date(), 'middle'),
            setDateTime(user.startDateGeneralStreak, 'middle')
          )
        ).keys()
      ).map((i) => addDays(user.startDateGeneralStreak!, i))
    : [];

  const secondChance =
    user?.secondChanceDates?.map((scd) => new Date(scd)) || [];

  return (
    <DayPicker
      onDayClick={handleDayClick}
      toDate={toDate}
      fromDate={fromDate}
      defaultMonth={activeDay}
      weekStartsOn={1 as const}
      modifiers={{ secondChance, streak }}
      modifiersClassNames={{
        secondChance: 'rdp-second_chance',
        streak: 'rdp-streak_day',
      }}
      selected={activeDay}
      required
    />
  );
}
