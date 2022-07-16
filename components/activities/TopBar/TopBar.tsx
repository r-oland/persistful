// Components==============
import TopNavWrapper from 'global_components/TopNavWrapper/TopNavWrapper';
import { useMediaQ } from 'hooks/useMediaQ';
import React from 'react';
import styles from './TopBar.module.scss';
// =========================

export default function TopBar() {
  const query = useMediaQ('min', 1024);

  if (query)
    return (
      <div className={styles.wrapper}>
        <h2>Activities</h2>
      </div>
    );

  return (
    <TopNavWrapper>
      <div className={styles['mobile-wrapper']}>
        <p>Activities</p>
      </div>
    </TopNavWrapper>
  );
}
