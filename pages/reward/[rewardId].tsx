// Components==============
import useGetReward from 'actions/reward/useGetReward';
import useGetUser from 'actions/user/useGetUser';
import TopNav from 'components/reward/TopNav/TopNav';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styles from 'components/reward/Reward.module.scss';
import Content from 'global_components/RewardModal/Content';
import { useMediaQ } from 'hooks/useMediaQ';
// =========================

function RewardContent() {
  const id = useRouter().query.rewardId as string;
  const { data: user } = useGetUser();
  const key = user?.activeReward === id ? 'active' : id;
  const { data: reward } = useGetReward({ id, key });

  if (!reward) return null;

  return <Content reward={reward} />;
}

function NewRewardContent() {
  return <Content />;
}

export default function Reward() {
  const id = useRouter().query.rewardId as string;
  const { push } = useRouter();
  const query = useMediaQ('min', 768);

  useEffect(() => {
    if (query) push('/');
  }, [query]);

  return (
    <div className={styles.wrapper}>
      <TopNav />
      <div className={styles.content}>
        {id === 'new' ? <NewRewardContent /> : <RewardContent />}
      </div>
    </div>
  );
}
