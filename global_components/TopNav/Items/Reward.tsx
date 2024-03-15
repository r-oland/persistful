// Components==============
import useGetOpenRewards from 'actions/reward/useGetOpenRewards';
import useGetProgressRewards from 'actions/reward/useGetProgressRewards';
import { motion } from 'framer-motion';
import Button from 'global_components/Button/Button';
import RewardCard from 'global_components/RewardCard/RewardCard';
import { useMediaQ } from 'hooks/useMediaQ';
import { useRouter } from 'next/router';
import React from 'react';
import { framerTopNavChild } from 'utils/framerAnimations';
import styles from './Items.module.scss';
// =========================

function DashboardRewards({
  setSelectedReward,
}: {
  setSelectedReward: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data: rewards } = useGetOpenRewards();

  const query = useMediaQ('min', 768);
  const { push } = useRouter();

  return (
    <motion.div
      className={`${styles['rewards-section']} ${rewards?.length === 1 ? styles['one-reward'] : ''}`}
      variants={framerTopNavChild}
    >
      <h3 className={styles.title}>Rewards</h3>
      <div className={styles.rewards}>
        {rewards?.map((reward) => (
          <RewardCard
            key={reward._id}
            reward={reward}
            setSelectedReward={setSelectedReward}
          />
        ))}
      </div>
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
    </motion.div>
  );
}

function ProgressRewards() {
  const { data: rewards } = useGetProgressRewards();

  return (
    <motion.div
      className={`${styles['rewards-section']} ${rewards?.length === 1 ? styles['one-reward'] : ''}`}
      variants={framerTopNavChild}
    >
      <h3 className={styles.title}>Earned Rewards</h3>
      {rewards?.length ? (
        <div className={styles.rewards}>
          {rewards.map((reward) => (
            <RewardCard key={reward._id} reward={reward} />
          ))}
        </div>
      ) : (
        <p className={styles['no-rewards']}>
          It seems that you did not earn any rewards during this period of time.
        </p>
      )}
    </motion.div>
  );
}

export default function Reward({
  setSelectedReward,
  page,
}: {
  setSelectedReward: React.Dispatch<React.SetStateAction<string>>;
  page: 'dashboard' | 'progress';
}) {
  if (page === 'dashboard')
    return <DashboardRewards setSelectedReward={setSelectedReward} />;
  return <ProgressRewards />;
}
