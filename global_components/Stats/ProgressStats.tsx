// Components==============
import {
  faCheck,
  faClock,
  faFlagCheckered,
  faFlame,
  faGauge,
  faLocationDot,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDeepComparison } from 'hooks/useDeepComparison';
import React, { useContext, useEffect, useState } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getDayAchievements } from 'utils/getDayAchievements';
import { ProgressContext } from 'pages/progress';
import useGetDays from 'actions/day/useGetDays';
import { useMediaQ } from 'hooks/useMediaQ';
import { format } from 'date-fns';
import styles from './Stats.module.scss';
// =========================

export default function ProgressStats() {
  const { isLoading, range } = useContext(ProgressContext);

  const desktopQuery = useMediaQ('min', 1024);
  const largeDesktopQuery = useMediaQ('min', 1500);

  // retry = false because days range can be selected that doesn't exists. This prevents it from trying to query in it on fail
  const { data: days } = useGetDays(range[0], range[1], {
    retry: false,
  });

  const defaultState: {
    totalTime: string;
    averageTime: string;
    totalCycles: number;
    daysTracked: number;
    startDate: string;
    endDate: string;
  } = {
    totalTime: '0:00',
    averageTime: '0:00',
    totalCycles: 0,
    daysTracked: 0,
    startDate: format(new Date(), 'dd MMM yyyy'),
    endDate: format(new Date(), 'dd MMM yyyy'),
  };

  const [displayData, setDisplayData] = useState(defaultState);

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (!days && !isLoading) return setDisplayData(defaultState);
    if (isLoading) return;

    const totalTime =
      days
        ?.map((d) => getDayAchievements(d).total)
        .reduce((prev, cur) => prev + cur, 0) || 0;

    const averageTime = totalTime / (days?.length || 1);

    const totalCycles =
      days
        ?.map((d) => getDayAchievements(d).streak)
        .reduce((prev, cur) => prev + cur, 0) || 0;

    const daysTracked = days?.length || 0;

    const startDate = format(range[0], 'dd MMM yyyy');
    const endDate = format(range[1], 'dd MMM yyyy');

    return setDisplayData({
      totalTime: convertMinutesToHours(totalTime),
      averageTime: convertMinutesToHours(averageTime),
      totalCycles,
      daysTracked,
      startDate,
      endDate,
    });
  }, [useDeepComparison(days), isLoading]);

  const conditionalData = largeDesktopQuery
    ? [
        {
          name: 'Total cycles',
          icon: faFlame,
          data: displayData.totalCycles,
        },
        {
          name: 'Days tracked',
          icon: faCheck,
          data: displayData.daysTracked,
        },
      ]
    : [];

  const cards = desktopQuery
    ? [
        {
          name: 'Total time',
          icon: faClock,
          data: displayData.totalTime,
        },
        {
          name: 'Average time',
          icon: faGauge,
          data: displayData.averageTime,
        },
        ...conditionalData,
      ]
    : [
        {
          name: 'Start date',
          icon: faLocationDot,
          data: displayData.startDate,
        },
        {
          name: 'End date',
          icon: faFlagCheckered,
          data: displayData.endDate,
        },
      ];

  return (
    <div
      className={styles.wrapper}
      style={{ gridTemplateColumns: `repeat(${cards.length}, 1fr)` }}
    >
      {cards.map((card) => (
        <div key={card.name} className={`${styles.card} ${styles.green}`}>
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
