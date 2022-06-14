// Components==============
import { endOfWeek, startOfWeek } from 'date-fns';
import { useDeepComparison } from 'hooks/useDeepComparison';
import React, { useContext, useEffect, useState } from 'react';
import { setDateTime } from 'utils/setDateTime';
import { sortOnCreatedAt } from 'utils/sortOnCreatedAt';
import { DesktopOverviewContext } from '../DesktopOverview';
import Week from './Week/Week';
import styles from './Weeks.module.scss';
// =========================

export default function Weeks({ days }: { days?: DayEntity[] }) {
  const { isLoading } = useContext(DesktopOverviewContext);

  const [weeksInRange, setWeeksInRange] = useState<DayEntity[][]>([]);

  useEffect(() => {
    if (!days && !isLoading) return setWeeksInRange([]);
    if (isLoading) return;

    const sortedDays = sortOnCreatedAt([...days!], 'desc');

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
  }, [useDeepComparison(days), isLoading]);

  if (!weeksInRange?.length) return <></>;

  return (
    <div className={styles.wrapper}>
      <h3>Weeks</h3>
      <div className={styles.weeks}>
        {weeksInRange.map(
          (week, i) =>
            !!week.length && (
              <Week
                days={week}
                key={week[0]._id}
                lastItem={weeksInRange.length - 1 === i}
              />
            )
        )}
      </div>
    </div>
  );
}
