// Components==============
import useGetDays from 'actions/day/useGetDays';
import { endOfWeek, startOfWeek } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { setDateTime } from 'utils/setDateTime';
import { sortOnCreatedAt } from 'utils/sortOnCreatedAt';
import { DesktopOverviewContext } from '../DesktopOverview';
import Week from './Week/Week';
import styles from './Weeks.module.scss';
// =========================

export default function Weeks() {
  const { range } = useContext(DesktopOverviewContext);

  const { data: days, isLoading } = useGetDays(range[0], range[1]);

  const [weeksInRange, setWeeksInRange] = useState<DayEntity[][]>([]);

  useEffect(() => {
    if (!days?.length) return;

    const sortedDays = sortOnCreatedAt([...days], 'desc');

    const weeks: DayEntity[][] = [];

    sortedDays.forEach((d) => {
      const date = new Date(d.createdAt);

      const lastWeekEntry = weeks?.[weeks.length - 1]?.[0]?.createdAt;

      const currentWeek = setDateTime(
        new Date(lastWeekEntry || d.createdAt),
        'middle'
      );

      const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 });
      const endOfCurrentWeek = endOfWeek(currentWeek, { weekStartsOn: 1 });

      // check if day falls in same week as the current week
      if (
        startOfCurrentWeek.getTime() < date.getTime() &&
        endOfCurrentWeek.getTime() > date.getTime()
      ) {
        if (weeks?.[weeks.length - 1]) return weeks?.[weeks.length - 1].push(d);
        return weeks.push([d]);
      }

      // Day is earlier then current week, at a new week
      weeks.push([d]);
    });

    setWeeksInRange(weeks);
  }, [days?.length]);

  if (!days && !isLoading) return <></>;

  return (
    <div className={styles.wrapper}>
      <h3>Weeks</h3>
      {weeksInRange.map((week, i) => (
        <Week week={week} key={i} />
      ))}
    </div>
  );
}
