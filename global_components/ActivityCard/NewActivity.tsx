// Components==============
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HardShadow from 'global_components/HardShadow/HardShadow';
import { ActivitiesContext } from 'pages/activities';
import React, { useContext } from 'react';
import styles from './ActivityCard.module.scss';
// =========================

export default function NewActivity() {
  const { setSelectedActivity, selectedActivity } =
    useContext(ActivitiesContext);

  return (
    <HardShadow stretch animations>
      <div
        className={`
          ${styles.wrapper}  ${
          selectedActivity === 'new-activity' ? styles.selected : ''
        }
            `}
        onClick={() => setSelectedActivity('new-activity')}
      >
        <div
          className={styles.content}
          // to account for missing space due to a lack of count
          style={{ padding: '1.07rem 1rem' }}
        >
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
          <div className={styles.info}>
            <p>New actvitiy</p>
          </div>
        </div>
        <div className={styles.bar} />
      </div>
    </HardShadow>
  );
}
