// Components==============
import useGetUser from 'actions/user/useGetUser';
import { add, addDays, differenceInDays } from 'date-fns';
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

  const streak = user?.startDateGeneralStreak
    ? Array.from(
        Array(differenceInDays(new Date(), user.startDateGeneralStreak)).keys()
      ).map((i) => addDays(user.startDateGeneralStreak!, i))
    : [];

  const secondChance =
    user?.secondChanceDates?.map((scd) => new Date(scd)) || [];

  const sharedProps = {
    onDayClick: handleDayClick,
    toDate: new Date(),
    defaultMonth: activeDay,
    weekStartsOn: 1 as const,
    modifiers: { secondChance, streak },
    modifiersClassNames: {
      secondChance: 'rdp-second_chance',
      streak: 'rdp-streak_day',
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
