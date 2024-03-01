// Components==============
import React, { useContext } from 'react';
import { ProgressContext } from 'pages/progress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlagCheckered,
  faLocationDot,
} from '@fortawesome/pro-solid-svg-icons';
import { format } from 'date-fns';
import styles from './StartEndDate.module.scss';
// =========================

export default function StartEndDate() {
  const { range } = useContext(ProgressContext);

  return (
    <div className={styles.wrapper}>
      <div>
        <span>
          <FontAwesomeIcon icon={faLocationDot} /> Start date
        </span>
        <p>{format(range.from, 'dd MMM yyyy')}</p>
      </div>
      <div className={styles['end-date']}>
        <span>
          <FontAwesomeIcon icon={faFlagCheckered} /> End date
        </span>
        <p>{format(range.to, 'dd MMM yyyy')}</p>
      </div>
    </div>
  );
}
