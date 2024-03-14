// Components==============
import useGetProgressDays from 'actions/day/useGetProgressDays';
import { addDays, differenceInDays, endOfDay, startOfDay } from 'date-fns';
import React from 'react';
import { DayPicker } from 'react-day-picker';
import { getDayAchievements } from 'utils/getDayAchievements';
import { setDateTime } from 'utils/setDateTime';
// =========================

export default function RangeCalendar({
  range,
  setRange,
  highlightedDay,
}: {
  range: { from: Date; to: Date };
  setRange: React.Dispatch<React.SetStateAction<{ from: Date; to: Date }>>;
  highlightedDay?: Date;
}) {
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
    ).map((i) => addDays(range.from, i)) || [];

  const streakDays =
    customDays
      ?.filter((d) => d.hasStreak)
      ?.map((d) => setDateTime(new Date(d.date), 'middle')) || [];

  const noStreakDays =
    customDays
      ?.filter((d) => !d.hasStreak)
      ?.map((d) => setDateTime(new Date(d.date), 'middle')) || [];

  const highlightedDayMod = highlightedDay ? [highlightedDay] : [];

  return (
    <DayPicker
      toDate={new Date()}
      fromDate={days?.[0]?.createdAt}
      defaultMonth={range.to}
      weekStartsOn={1 as const}
      modifiers={{ rangeSelected, streakDays, noStreakDays, highlightedDayMod }}
      modifiersClassNames={{
        noStreakDays: 'rdp-range_no_streak_day',
        streakDays: 'rdp-range_streak_day',
        rangeSelected: 'rdp-range_selected',
        highlightedDayMod: 'rdp-range_highlighted_day',
      }}
      selected={range}
      month={highlightedDay}
      onSelect={(rangeValue) => {
        // User clicked on first date again, default is to unset complete range. Override this by setting range to first date
        if (!rangeValue)
          return setRange((prev) => ({
            from: startOfDay(prev.from),
            to: endOfDay(prev.from),
          }));

        // User clicked on second date, default is to set new start range starting from this date. Override this by setting range to second date
        if (!rangeValue?.to && rangeValue?.from)
          return setRange({
            from: startOfDay(rangeValue.from),
            to: endOfDay(rangeValue.from),
          });

        setRange({
          from: startOfDay(rangeValue.from as Date),
          to: endOfDay(rangeValue.to as Date),
        });
      }}
      mode="range"
    />
  );
}
