// Components==============
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HardShadow from 'global_components/HardShadow/HardShadow';
import { useMediaQ } from 'hooks/useMediaQ';
import { useRouter } from 'next/router';
import { ActivitiesContext } from 'pages/activities';
import React, { useContext } from 'react';
import styles from './ActivityCard.module.scss';
// =========================

export default function NewActivity() {
  const query = useMediaQ('min', 525);
  const clickQuery = useMediaQ('min', 1024);
  const { setSelectedActivity, selectedActivity } =
    useContext(ActivitiesContext);

  const { push } = useRouter();

  return (
    <HardShadow stretch animations>
      <div
        className={`
          ${styles.wrapper}  ${
          selectedActivity === 'new-activity' ? styles.selected : ''
        }
            `}
        onClick={() =>
          clickQuery
            ? setSelectedActivity('new-activity')
            : push('/activity/new')
        }
      >
        {!query && <div className={styles['mobile-bar']} />}
        <div className={styles.content}>
          <div className={styles['icon-wrapper']}>
            <div className={styles.icon}>
              <FontAwesomeIcon icon={faPlus} />
            </div>
          </div>
          <div className={styles.info}>
            <p>New activity</p>
          </div>
        </div>
        {query && <div className={styles.bar} />}
      </div>
    </HardShadow>
  );
}
