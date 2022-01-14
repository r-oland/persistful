// Components==============
import SideBarWrapper from 'global_components/LayoutWrappers/SideBarWrapper/SideBarWrapper';
import NewRewardCard from 'global_components/NewRewardCard/NewRewardCard';
import React from 'react';
import styles from './SideBar.module.scss';
// =========================

export default function SideBar() {
  return (
    <SideBarWrapper>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Next reward</h3>
        <NewRewardCard />
      </div>
    </SideBarWrapper>
  );
}
