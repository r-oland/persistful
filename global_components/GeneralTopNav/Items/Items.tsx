// Components==============
import { motion } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
import NewRewardCard from 'global_components/NewRewardCard/NewRewardCard';
import RewardCard from 'global_components/RewardCard/RewardCard';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { useEffect, useRef, useState } from 'react';
import { framerTopNavChild, framerTopNavParent } from 'utils/framerAnimations';
import { TopNavSelectedOption } from '../GeneralTopNav';
import styles from './Items.module.scss';
// =========================

function Reward({
  activeReward,
  setModalIsOpen,
}: {
  activeReward?: RewardEntity;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <motion.div className={styles.reward} variants={framerTopNavChild}>
      <h3 className={styles.title}>Rewards</h3>
      {activeReward ? (
        <RewardCard reward={activeReward} setModalIsOpen={setModalIsOpen} />
      ) : (
        <NewRewardCard setModalIsOpen={setModalIsOpen} />
      )}
    </motion.div>
  );
}

function CalendarComp({
  activeDay,
  setActiveDay,
  overview,
}: {
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
  overview?: boolean;
}) {
  return (
    <motion.div variants={framerTopNavChild}>
      <Calendar
        activeDay={activeDay}
        setActiveDay={setActiveDay}
        week={overview}
      />
    </motion.div>
  );
}

export default function Items({
  selected,
  setSelected,
  activeReward,
  rewardModalIsOpen,
  setRewardModalIsOpen,
  activeDay,
  setActiveDay,
  overview,
}: {
  selected: TopNavSelectedOption;
  setSelected: React.Dispatch<React.SetStateAction<TopNavSelectedOption>>;
  activeReward?: RewardEntity;
  rewardModalIsOpen: boolean;
  setRewardModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
  overview?: boolean;
}) {
  const ref = useRef(null);

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
      variants={framerTopNavParent}
      className={`${styles.wrapper} ${styles[selected]}`}
      ref={ref}
    >
      {selected === 'bar' ? (
        <>
          <CalendarComp
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            overview={overview}
          />
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
        <CalendarComp
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          overview={overview}
        />
      ) : (
        <></>
      )}
    </motion.div>
  );
}
