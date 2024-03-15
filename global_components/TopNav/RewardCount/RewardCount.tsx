// Components==============
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/pro-solid-svg-icons';
import useGetUser from 'actions/user/useGetUser';
import useGetOpenRewards from 'actions/reward/useGetOpenRewards';
import useGetProgressRewards from 'actions/reward/useGetProgressRewards';
import { TopNavSelectedOption } from '../TopNav';
import styles from './RewardCount.module.scss';
// =========================

export function DashboardRewardCount({
  setSelected,
}: {
  setSelected: React.Dispatch<React.SetStateAction<TopNavSelectedOption>>;
}) {
  const { data: rewards } = useGetOpenRewards();
  const { data: user } = useGetUser();

  const activeReward = rewards?.find((r) => r._id === user?.activeReward);

  return (
    <div className={styles.wrapper} onClick={() => setSelected('streak')}>
      <FontAwesomeIcon icon={faGift} />
      {!!rewards && (
        <div
          className={`${styles.counter} ${
            activeReward?.completedCycles === activeReward?.totalCycles
              ? styles.completed
              : ''
          }`}
        >
          <p>{activeReward?.completedCycles || 0}</p>
        </div>
      )}
    </div>
  );
}

export function ProgressRewardCount({
  setSelected,
}: {
  setSelected: React.Dispatch<React.SetStateAction<TopNavSelectedOption>>;
}) {
  const { data: rewards } = useGetProgressRewards();

  return (
    <div className={styles.wrapper} onClick={() => setSelected('streak')}>
      <FontAwesomeIcon icon={faGift} />
      {!!rewards?.length && (
        <div className={styles.counter}>
          <p>{rewards.length}</p>
        </div>
      )}
    </div>
  );
}
