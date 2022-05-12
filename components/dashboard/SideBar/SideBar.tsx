// Components==============
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import { AnimatePresence } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
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
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.calendar}>
            <Calendar />
          </div>
          <div className={styles.reward}>
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
      </div>
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
