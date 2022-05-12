// Components==============
import { motion } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
import NewRewardCard from 'global_components/NewRewardCard/NewRewardCard';
import RewardCard from 'global_components/RewardCard/RewardCard';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import { DashboardContext } from 'pages';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { TopNavSelectedOption } from '../TopNav';
import styles from './Items.module.scss';
// =========================

const parent = {
  hidden: {
    opacity: 0,
    height: 50,
    padding: 0,
    transition: {
      opacity: {
        delay: 0.7,
      },
      height: {
        duration: 0.3,
        delay: 0.3,
      },
      padding: {
        delay: 0.2,
      },
    },
  },
  show: {
    opacity: 1,
    height: 355,
    padding: '2.5rem 3rem',
    transition: {
      delayChildren: 0.5,
      opacity: {
        duration: 0.2,
      },
      height: {
        duration: 0.3,
        delay: 0.25,
      },
      padding: {
        delay: 0.2,
      },
    },
  },
};

const child = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

function Reward({
  activeReward,
  setModalIsOpen,
}: {
  activeReward?: RewardEntity;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <motion.div className={styles.reward} variants={child}>
      <h3 className={styles.title}>Next reward</h3>
      {activeReward ? (
        <RewardCard reward={activeReward} setModalIsOpen={setModalIsOpen} />
      ) : (
        <NewRewardCard setModalIsOpen={setModalIsOpen} />
      )}
    </motion.div>
  );
}

function CalendarComp() {
  return (
    <motion.div variants={child}>
      <Calendar />
    </motion.div>
  );
}

export default function Items({
  selected,
  setSelected,
  activeReward,
  rewardModalIsOpen,
  setRewardModalIsOpen,
}: {
  selected: TopNavSelectedOption;
  setSelected: React.Dispatch<React.SetStateAction<TopNavSelectedOption>>;
  activeReward?: RewardEntity;
  rewardModalIsOpen: boolean;
  setRewardModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
    if (rewardModalIsOpen) setSelected('none');
  }, [rewardModalIsOpen]);

  return (
    <motion.div
      initial="hidden"
      exit="hidden"
      animate="show"
      variants={parent}
      className={`${styles.wrapper} ${styles[selected]}`}
      ref={ref}
    >
      {selected === 'bar' ? (
        <>
          <CalendarComp />
          <Reward
            activeReward={activeReward}
            setModalIsOpen={setRewardModalIsOpen}
          />
        </>
      ) : selected === 'streak' ? (
        <Reward
          activeReward={activeReward}
          setModalIsOpen={setRewardModalIsOpen}
        />
      ) : selected === 'calendar' ? (
        <CalendarComp />
      ) : (
        <></>
      )}
    </motion.div>
  );
}
