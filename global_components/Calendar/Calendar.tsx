// Components==============
import useGetUser from 'actions/user/useGetUser';
import { add, addDays } from 'date-fns';
import React from 'react';
import { DayPicker } from 'react-day-picker';
import { getStartEndWeek } from 'utils/getStartEndWeek';
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

  const { firstDay } = getStartEndWeek(activeDay);

  const currentWeek = Array.from(Array(7).keys()).map((i) =>
    addDays(firstDay, i)
  );

  const secondChance =
    user?.secondChanceDates?.map((scd) => new Date(scd)) || [];

  return (
    <DayPicker
      selected={activeDay}
      onDayClick={handleDayClick}
      required
      toDate={new Date()}
      mode="single"
      defaultMonth={activeDay}
      weekStartsOn={1}
      modifiers={{ secondChance, currentWeek }}
      modifiersClassNames={{
        secondChance: 'rdp-second_chance',
        currentWeek: 'rdp-current_week',
      }}
    />
  );
}
