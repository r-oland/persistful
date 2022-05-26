// Components==============
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import { AnimatePresence } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
import RewardCard from 'global_components/RewardCard/RewardCard';
import RewardModal from 'global_components/RewardModal/RewardModal';
import React, { useContext, useState } from 'react';
import { DesktopOverviewContext } from '../DesktopOverview';
import styles from './SideBar.module.scss';
// =========================

export default function SideBar() {
  const { data: activeReward } = useGetActiveReward();
  const [rewardModalIsOpen, setRewardModalIsOpen] = useState(false);

  const { activeDay, setActiveDay, rewards } = useContext(
    DesktopOverviewContext
  );

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.calendar}>
            <Calendar activeDay={activeDay} setActiveDay={setActiveDay} />
          </div>
          <div className={styles.reward}>
            <h3 className={styles.title}>
              Earned reward{rewards.length === 1 ? '' : 's'}
            </h3>
            {rewards.length ? (
              <div className={styles['reward-wrapper']}>
                {rewards.map((r) => (
                  <RewardCard reward={r} key={r._id} overview />
                ))}
              </div>
            ) : (
              <p className={styles['no-rewards']}>
                It seems that you did not earn any rewards during this period of
                time.
              </p>
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
