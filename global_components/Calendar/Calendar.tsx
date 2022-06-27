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
  week,
}: {
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
  week?: boolean;
}) {
  const { data: user } = useGetUser();

  const handleDayClick = (day: Date) => {
    const middleOfDay = add(day, { hours: 12 });
    setActiveDay(middleOfDay);
  };

  const { firstDay, lastDay } = getStartEndWeek(activeDay);

  const currentWeek = Array.from(Array(7).keys()).map((i) =>
    addDays(firstDay, i)
  );

  const secondChance =
    user?.secondChanceDates?.map((scd) => new Date(scd)) || [];

  const sharedProps = {
    onDayClick: handleDayClick,
    toDate: new Date(),
    defaultMonth: activeDay,
    weekStartsOn: 1 as const,
    modifiers: { secondChance, currentWeek },
    modifiersClassNames: {
      secondChance: 'rdp-second_chance',
      currentWeek: 'rdp-current_week',
    },
  };

  if (week)
    return (
      <DayPicker
        {...sharedProps}
        selected={{ from: firstDay, to: lastDay }}
        mode="range"
      />
    );

  return <DayPicker {...sharedProps} selected={activeDay} required />;
}
