// Components==============
import { faCheck, faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetDays from 'actions/day/useGetDays';
import React, { useContext, useEffect, useState } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getPastDay } from 'utils/getPastDay';
import { MobileOverviewContext } from 'components/overview/MobileOverview/MobileOverview';
import styles from './Stats.module.scss';
// =========================

const defaultValues = {
  total: '0:00',
  trackedDays: 0,
};

export default function MobileOverviewStats() {
  const [displayData, setDisplayData] = useState(defaultValues);

  const { activeDay } = useContext(MobileOverviewContext);

  // Change it so that it is 6 days in the past. -> not 7 because today also counts
  const lastWeek = getPastDay(activeDay, 6);

  // retry = false because days range can be selected that doesn't exists. This prevents it from trying to query in it on fail
  const { data: days } = useGetDays(lastWeek, activeDay, { retry: false });

  const totalDays =
    days
      ?.map((d) => getDayAchievements(d).total)
      .reduce((prev, cur) => prev + cur) || 0;

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (days)
      return setDisplayData({
        total: convertMinutesToHours(totalDays),
        trackedDays: days?.length,
      });

    setDisplayData(defaultValues);
  }, [JSON.stringify(days)]);

  const cards = [
    {
      name: 'Tracked days',
      icon: faCheck,
      color: displayData.trackedDays <= 3 ? 'red' : 'green',
      data: displayData.trackedDays,
    },
    {
      name: 'Total',
      icon: faClock,
      color: totalDays < 120 ? 'red' : 'green',
      data: displayData.total,
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
