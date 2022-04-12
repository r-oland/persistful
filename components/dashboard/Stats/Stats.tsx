// Components==============
import { faFlame } from '@fortawesome/pro-regular-svg-icons';
import {
  faCalendarWeek,
  faClock,
  faTimesHexagon,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMediaQ } from 'hooks/useMediaQ';
import React from 'react';
import styles from './Stats.module.scss';
// =========================

export default function Stats() {
  const query = useMediaQ('min', 1024);

  const mobileCards = [
    { name: 'Average (week)', icon: faCalendarWeek, color: 'green', data: 0 },
    { name: 'Total (week)', icon: faClock, color: 'green', data: 0 },
  ];

  const desktopCards = [
    {
      name: 'Penalty days (week)',
      icon: faTimesHexagon,
      color: 'red',
      data: 0,
    },
    { name: 'Streak count (week)', icon: faFlame, color: 'red', data: 0 },
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
