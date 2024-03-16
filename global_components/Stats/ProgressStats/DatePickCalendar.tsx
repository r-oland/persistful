// Components==============
import { addDays, differenceInDays, endOfDay, startOfDay } from 'date-fns';
import React, { useContext } from 'react';
import { DayPicker } from 'react-day-picker';
import { setDateTime } from 'utils/setDateTime';
import useGetProgressDays from 'actions/day/useGetProgressDays';
import { getDayAchievements } from 'utils/getDayAchievements';
import { ProgressContext } from 'pages/progress';
// =========================

export default function DatePickCalendar({
  fromOrTo,
  setFromOrTo,
}: {
  fromOrTo: 'from' | 'to';
  setFromOrTo: React.Dispatch<React.SetStateAction<'from' | 'to' | undefined>>;
}) {
  const { range, setRange } = useContext(ProgressContext);

  const activeDay = range[fromOrTo];

  const handleDayClick = (day: Date) => {
    setRange((prev) => {
      // Close modal
      setFromOrTo(undefined);

      // Change data
      return {
        ...prev,
        [fromOrTo]:
          fromOrTo === 'from' ? startOfDay(day as Date) : endOfDay(day as Date),
      };
    });
  };

  const { data: days } = useGetProgressDays({ allDays: true });

  const customDays = days?.map((d) => ({
    date: d.createdAt,
    hasStreak: getDayAchievements(d).streak,
  }));

  const rangeSelected =
    Array.from(
      Array(
        differenceInDays(
          setDateTime(range.to, 'middle'),
          setDateTime(range.from, 'middle')
        ) + 1
      ).keys()
    )
      .map((i) => addDays(range.from, i))
      .filter(
        (d) => d.toLocaleDateString() !== activeDay.toLocaleDateString()
      ) || [];

  const streakDays =
    customDays
      ?.filter((d) => d.hasStreak)
      ?.map((d) => setDateTime(new Date(d.date), 'middle')) || [];

  const noStreakDays =
    customDays
      ?.filter((d) => !d.hasStreak)
      ?.map((d) => setDateTime(new Date(d.date), 'middle')) || [];

  return (
    <DayPicker
      onDayClick={handleDayClick}
      fromDate={fromOrTo === 'to' ? range.from : days?.[0].createdAt}
      toDate={fromOrTo === 'from' ? range.to : new Date()}
      defaultMonth={activeDay}
      weekStartsOn={1 as const}
      modifiers={{ rangeSelected, streakDays, noStreakDays }}
      modifiersClassNames={{
        noStreakDays: 'rdp-range_no_streak_day',
        streakDays: 'rdp-range_streak_day',
        rangeSelected: 'rdp-range_selected',
        highlightedDayMod: 'rdp-range_highlighted_day',
      }}
      selected={activeDay}
      required
      showOutsideDays
      fixedWeeks
    />
  );
}
