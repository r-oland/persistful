// Components==============
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TopNavWrapper from 'global_components/TopNavWrapper/TopNavWrapper';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './TopNav.module.scss';
// =========================

export default function TopNav() {
  const { push } = useRouter();

  return (
    <TopNavWrapper>
      <div className={styles.wrapper}>
        <div className={styles.back} onClick={() => push('/activities')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <p>Activities</p>
        </div>
      </div>
    </TopNavWrapper>
  );
}
