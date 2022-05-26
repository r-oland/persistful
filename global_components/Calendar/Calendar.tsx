// Components==============
import useGetUser from 'actions/user/useGetUser';
import { add } from 'date-fns';
import React from 'react';
import { DayPicker } from 'react-day-picker';
// =========================

export default function Calendar({
  activeDay,
  setActiveDay,
}: {
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const { data: user } = useGetUser();

  const handleDayClick = (day: Date) => {
    const middleOfDay = add(day, { hours: 12 });
    setActiveDay(middleOfDay);
  };

  const modifiers = user?.lastSecondChance
    ? { secondChance: [new Date(user?.lastSecondChance)] }
    : undefined;

  return (
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
  );
}
