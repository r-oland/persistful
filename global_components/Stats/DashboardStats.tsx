// Components==============
import { faFlame } from '@fortawesome/pro-regular-svg-icons';
import {
  faCalendarWeek,
  faClock,
  faTimesHexagon,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetDays from 'actions/day/useGetDays';
import { useMediaQ } from 'hooks/useMediaQ';
import { DashboardContext } from 'pages';
import React, { useContext, useEffect, useState } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getStartEndWeek } from 'utils/getStartEndWeek';
import styles from './Stats.module.scss';
// =========================

export default function DashboardStats() {
  const [displayData, setDisplayData] = useState({
    average: '0:00',
    total: '0:00',
    penaltyDays: '0 / 0',
    streaks: 0,
  });

  const { activeDay } = useContext(DashboardContext);

  const query = useMediaQ('min', 1024);

  const { firstDay, lastDay } = getStartEndWeek(activeDay);

  const { data: days } = useGetDays(firstDay, lastDay);

  const amountOfDays = days?.length || 0;

  const totalDays =
    days
      ?.map((d) => getDayAchievements(d).total)
      .reduce((prev, cur) => prev + cur) || 0;

  const average = totalDays / amountOfDays;

  const penaltyDayCount = days?.filter((d) =>
    d.activities.find((a) => a.penalty && a.count)
  ).length;

  const streaks =
    days
      ?.map((d) => getDayAchievements(d).streak)
      .reduce((prev, cur) => prev + cur) || 0;

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (days)
      setDisplayData({
        average: convertMinutesToHours(average),
        total: convertMinutesToHours(totalDays),
        penaltyDays: `${penaltyDayCount} / ${days?.length}`,
        streaks,
      });
  }, [JSON.stringify(days)]);

  const mobileCards = [
    {
      name: 'Average (week)',
      icon: faCalendarWeek,
      color: 'green',
      data: displayData.average,
    },
    {
      name: 'Total (week)',
      icon: faClock,
      color: 'green',
      data: displayData.total,
    },
  ];

  const desktopCards = [
    {
      name: 'Penalty days (week)',
      icon: faTimesHexagon,
      color: 'red',
      data: displayData.penaltyDays,
    },
    {
      name: 'Total streaks (week)',
      icon: faFlame,
      color: 'red',
      data: displayData.streaks,
    },
  ];

  const cards = query ? [...mobileCards, ...desktopCards] : mobileCards;

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
