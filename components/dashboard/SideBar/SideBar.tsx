// Components==============
import useGetOpenRewards from 'actions/reward/useGetOpenRewards';
import { AnimatePresence } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
import RewardCard from 'global_components/RewardCard/RewardCard';
import RewardModal from 'global_components/RewardModal/RewardModal';
import { DashboardContext } from 'pages';
import React, { useContext, useState } from 'react';
import Button from 'global_components/Button/Button';
import { useRouter } from 'next/router';
import { useMediaQ } from 'hooks/useMediaQ';
import styles from './SideBar.module.scss';
// =========================

export default function SideBar() {
  const { data: openRewards } = useGetOpenRewards();
  const [selectedReward, setSelectedReward] = useState('initial');

  const query = useMediaQ('min', 768);
  const { push } = useRouter();

  const { activeDay, setActiveDay } = useContext(DashboardContext);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.calendar}>
            <Calendar activeDay={activeDay} setActiveDay={setActiveDay} />
          </div>
          <div className={styles['rewards-section']}>
            <h3 className={styles.title}>Rewards</h3>
            {!!openRewards?.length && (
              <>
                <div
                  className={`${styles.rewards} ${openRewards.length > 2 ? styles['has-scroll'] : ''}`}
                >
                  {openRewards?.map((openReward) => (
                    <RewardCard
                      key={openReward._id}
                      reward={openReward}
                      setSelectedReward={setSelectedReward}
                    />
                  ))}
                </div>
                {!!(openRewards.length > 2) && <div className={styles.bar} />}
              </>
            )}
            <div className={styles['reward-button']}>
              <Button
                color="white"
                onClick={() =>
                  query ? setSelectedReward('new') : push('/reward/new')
                }
              >
                New Reward
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {selectedReward !== 'initial' && (
          <RewardModal
            setSelectedReward={setSelectedReward}
            reward={openRewards?.find((or) => or._id === selectedReward)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
