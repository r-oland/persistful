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
import React from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getDayAchievements } from 'utils/getDayAchievements';
import styles from './Stats.module.scss';
// =========================

export default function Stats() {
  const query = useMediaQ('min', 1024);

  // Get today's date using the JavaScript Date object.
  const lastWeek = new Date();

  // Change it so that it is 7 days in the past.
  const pastDate = lastWeek.getDate() - 7;
  lastWeek.setDate(pastDate);

  const { data: days } = useGetDays(lastWeek, new Date());

  const totalDays =
    days
      ?.map((d) => getDayAchievements(d).total)
      .reduce((prev, cur) => prev + cur) || 0;

  const average = totalDays / 7;

  const penaltyDayCount = days?.filter((d) =>
    d.activities.find((a) => a.penalty && a.count)
  ).length;

  const streaks = days
    ?.map((d) => getDayAchievements(d).streak)
    .reduce((prev, cur) => prev + cur);

  const mobileCards = [
    {
      name: 'Average (week)',
      icon: faCalendarWeek,
      color: 'green',
      data: convertMinutesToHours(average),
    },
    {
      name: 'Total (week)',
      icon: faClock,
      color: 'green',
      data: convertMinutesToHours(totalDays),
    },
  ];

  const desktopCards = [
    {
      name: 'Penalty days (week)',
      icon: faTimesHexagon,
      color: 'red',
      data: penaltyDayCount,
    },
    {
      name: 'Total streaks (week)',
      icon: faFlame,
      color: 'red',
      data: streaks,
    },
  ];

  const cards = query ? [...mobileCards, ...desktopCards] : mobileCards;

  return (
    <div className={styles.wrapper}>
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
