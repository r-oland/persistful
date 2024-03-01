// Components==============
import React, { useContext, useEffect, useState } from 'react';
import { ProgressContext } from 'pages/progress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlagCheckered,
  faLocationDot,
} from '@fortawesome/pro-solid-svg-icons';
import { format } from 'date-fns';
import useGetDays from 'actions/day/useGetDays';
import { useDeepComparison } from 'hooks/useDeepComparison';
import styles from './StartEndDate.module.scss';
// =========================

export default function StartEndDate() {
  const { range } = useContext(ProgressContext);
  const { data: days, isLoading } = useGetDays(range[0], range[1]);

  // Use state to prevent undefined values while switching days
  const [displayDates, setDisplayDates] = useState(range);

  useEffect(() => {
    if (!days?.[0]?.createdAt || !days?.[0]?.createdAt || isLoading) return;

    setDisplayDates([days[0].createdAt, days[days.length - 1].createdAt]);
  }, [isLoading, useDeepComparison(days)]);

  return (
    <div className={styles.wrapper}>
      <div>
        <span>
          <FontAwesomeIcon icon={faLocationDot} /> Start date
        </span>
        <p>{format(displayDates[0] || range[0], 'dd MMM yyyy')}</p>
      </div>
      <div className={styles['end-date']}>
        <span>
          <FontAwesomeIcon icon={faFlagCheckered} /> End date
        </span>
        <p>{format(displayDates[1], 'dd MMM yyyy')}</p>
      </div>
    </div>
  );
}
