// Components==============
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import { AnimatePresence } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
import SideBarWrapper from 'global_components/LayoutWrappers/SideBarWrapper/SideBarWrapper';
import NewRewardCard from 'global_components/NewRewardCard/NewRewardCard';
import RewardCard from 'global_components/RewardCard/RewardCard';
import RewardModal from 'global_components/RewardModal/RewardModal';
import React, { useState } from 'react';
import styles from './SideBar.module.scss';
// =========================

export default function SideBar() {
  const { data: activeReward } = useGetActiveReward();
  const [rewardModalIsOpen, setRewardModalIsOpen] = useState(false);

  return (
    <>
      <SideBarWrapper>
        <div className={styles.wrapper}>
          <Calendar />
          <div>
            <h3 className={styles.title}>Next reward</h3>
            {activeReward ? (
              <RewardCard
                reward={activeReward}
                setModalIsOpen={setRewardModalIsOpen}
              />
            ) : (
              <NewRewardCard setModalIsOpen={setRewardModalIsOpen} />
            )}
          </div>
        </div>
      </SideBarWrapper>
      <AnimatePresence>
        {rewardModalIsOpen && (
          <RewardModal
            setModalIsOpen={setRewardModalIsOpen}
            reward={activeReward}
          />
        )}
      </AnimatePresence>
    </>
  );
}
