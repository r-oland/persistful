// Components==============
import {
  faCalendarWeek,
  faCheck,
  faClock,
  faQuestionCircle,
  IconName,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetActivities from 'actions/activity/useGetActivities';
import useGetDays from 'actions/day/useGetDays';
import { DesktopOverviewContext } from 'components/overview/DesktopOverview/DesktopOverview';
import { format } from 'date-fns';
import { timestamp } from 'global_components/Calendar/OverviewCalendar';
import React, { useContext, useEffect, useState } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getActivityCount } from 'utils/getActivityCount';
import { getActivitySum } from 'utils/getActivitySum';
import { getDayAchievements } from 'utils/getDayAchievements';
import styles from './Stats.module.scss';
// =========================

export default function DesktopOverviewStats() {
  const { activeDay, range } = useContext(DesktopOverviewContext);

  const defaultState: {
    period: string;
    total: string;
    trackedDays: number;
    totalDays: number;
    mostActive?: DailyActivityEntity;
  } = {
    period: format(activeDay, 'MMMM'),
    total: '0:00',
    trackedDays: 0,
    totalDays: 0,
    mostActive: undefined,
  };

  const [displayData, setDisplayData] = useState(defaultState);

  // retry = false because days range can be selected that doesn't exists. This prevents it from trying to query in it on fail
  const { data: days } = useGetDays(range[0], range[1], { retry: false });

  const { data: activityEntities } = useGetActivities();

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (!days) return;
    if (!days.length) return setDisplayData(defaultState);

    const activities: DailyActivityEntity[] = [];

    days?.forEach((day) =>
      day.activities
        // filter out activities that have count
        .filter((a) => a.count)
        .forEach((activity) => {
          const sum = getActivitySum([activity]);
          const activityIndex = activities.findIndex(
            (a) => a._id === activity._id
          );
          // Item is already in array
          if (activityIndex !== -1) {
            const item = activities[activityIndex];
            // add sum to total
            if (item) item.count += sum;
            return;
          }
          // init item in array (destructure to prevent bug where days array from being incremented)
          return activities.push({ ...activity, count: sum });
        })
    );

    const mostActive = activities.sort((a, b) => b.count - a.count)?.[0];

    const totalDays =
      days
        ?.map((d) => getDayAchievements(d).total)
        .reduce((prev, cur) => prev + cur) || 0;

    return setDisplayData({
      period:
        range[0].getTime() === timestamp
          ? 'All time'
          : format(activeDay, 'MMMM'),
      totalDays,
      trackedDays: days?.length || 0,
      mostActive,
      total: convertMinutesToHours(totalDays),
    });
  }, [JSON.stringify(days)]);

  const cards = [
    {
      name: 'Period',
      icon: faCalendarWeek,
      color: 'green',
      data: displayData.period,
    },
    {
      name: 'Total',
      icon: faClock,
      color: displayData.totalDays < 120 ? 'red' : 'green',
      data: displayData.total,
    },
    {
      name: 'Tracked days',
      icon: faCheck,
      color: displayData.trackedDays <= 3 ? 'red' : 'green',
      data: displayData.trackedDays,
    },
    {
      name: 'Most active',
      icon:
        (activityEntities?.find((a) => a._id === displayData.mostActive?._id)
          ?.icon as IconName) || faQuestionCircle,
      color: displayData.mostActive
        ? displayData.mostActive?.penalty
          ? 'red'
          : 'green'
        : 'red',
      data: displayData.mostActive
        ? getActivityCount(displayData.mostActive)
        : '0:00',
    },
  ];

  return (
    <div
      className={styles.wrapper}
      style={{ gridTemplateColumns: `repeat(${cards.length}, 1fr)` }}
    >
      {cards.map((card) => (
        <div
          key={card.name}
          className={`${styles.card} ${
            styles[(card.color as 'green') || 'red']
          }`}
        >
          <div className={styles.icon}>
            <FontAwesomeIcon icon={card.icon} />
          </div>
          <div className={styles['text-wrapper']}>
            <p className={styles.name}>{card.name}</p>
            <p className={styles.data}>{card.data}</p>
          </div>
        </div>
      ))}
    </div>
  );
}