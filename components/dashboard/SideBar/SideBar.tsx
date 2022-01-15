// Components==============
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import SideBarWrapper from 'global_components/LayoutWrappers/SideBarWrapper/SideBarWrapper';
import NewRewardCard from 'global_components/NewRewardCard/NewRewardCard';
import RewardCard from 'global_components/RewardCard/RewardCard';
import React from 'react';
import styles from './SideBar.module.scss';
// =========================

export default function SideBar() {
  const { data: activeReward } = useGetActiveReward();

  return (
    <SideBarWrapper>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>Next reward</h3>
        {activeReward ? (
          <RewardCard reward={activeReward} />
        ) : (
          <NewRewardCard />
        )}
      </div>
    </SideBarWrapper>
  );
}
