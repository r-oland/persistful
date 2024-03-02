// Components==============
import { motion } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
import RewardCard from 'global_components/RewardCard/RewardCard';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { framerTopNavChild, framerTopNavParent } from 'utils/framerAnimations';
import Button from 'global_components/Button/Button';
import { useRouter } from 'next/router';
import useGetOpenRewards from 'actions/reward/useGetOpenRewards';
import { useMediaQ } from 'hooks/useMediaQ';
import { DashboardContext } from 'pages';
import useGetProgressRewards from 'actions/reward/useGetProgressRewards';
import { ProgressContext } from 'pages/progress';
import RangeCalendar from 'global_components/Calendar/RangeCalendar';
import { TopNavSelectedOption } from '../TopNav';
import styles from './Items.module.scss';
// =========================

function Reward({
  setSelectedReward,
  page,
}: {
  setSelectedReward: React.Dispatch<React.SetStateAction<string>>;
  page: 'dashboard' | 'progress';
}) {
  const { data: openRewards } = useGetOpenRewards({
    enabled: page === 'dashboard',
  });
  const { data: progressRewards } = useGetProgressRewards({
    enabled: page === 'progress',
  });

  const rewards = page === 'dashboard' ? openRewards : progressRewards;

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
            setSelectedReward={
              page === 'dashboard' ? setSelectedReward : undefined
            }
          />
        ))}
      </div>
      {page === 'dashboard' && (
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
      )}
    </motion.div>
  );
}

function CalendarComp({ page }: { page: 'dashboard' | 'progress' }) {
  const { activeDay, setActiveDay } = useContext(DashboardContext);
  const { range, setRange } = useContext(ProgressContext);

  return (
    <motion.div variants={framerTopNavChild}>
      {page === 'dashboard' ? (
        <Calendar activeDay={activeDay} setActiveDay={setActiveDay} />
      ) : (
        <RangeCalendar range={range} setRange={setRange} />
      )}
    </motion.div>
  );
}

export default function Items({
  selected,
  setSelected,
  selectedReward,
  setSelectedReward,
  page,
}: {
  selected: TopNavSelectedOption;
  setSelected: React.Dispatch<React.SetStateAction<TopNavSelectedOption>>;
  selectedReward: string;
  setSelectedReward: React.Dispatch<React.SetStateAction<string>>;
  page: 'dashboard' | 'progress';
}) {
  const ref = useRef(null);

  const { activeDay } = useContext(DashboardContext);

  useOnClickOutside({
    refs: [ref],
    handler: () => {
      setSelected('none');
    },
  });

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(1);
    if (key === 0) return;

    setSelected('none');
  }, [activeDay]);

  useEffect(() => {
    if (selectedReward !== 'initial') setSelected('none');
  }, [selectedReward]);

  return (
    <motion.div
      initial="hidden"
      exit="hidden"
      animate="show"
      variants={framerTopNavParent}
      className={`${styles.wrapper} ${styles[selected]}`}
      ref={ref}
    >
      {selected === 'bar' ? (
        <>
          <CalendarComp page={page} />
          <Reward page={page} setSelectedReward={setSelectedReward} />
        </>
      ) : selected === 'streak' ? (
        <Reward page={page} setSelectedReward={setSelectedReward} />
      ) : selected === 'calendar' ? (
        <CalendarComp page={page} />
      ) : (
        <></>
      )}
    </motion.div>
  );
}
