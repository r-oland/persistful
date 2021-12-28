// Components==============
import TopNavWrapper from 'global_components/LayoutWrappers/TopNavWrapper/TopNavWrapper';
import React from 'react';
import styles from './TopNav.module.scss';
// =========================

export default function TopNav() {
  return (
    <TopNavWrapper>
      <div className={styles.wrapper} />
    </TopNavWrapper>
  );
}
