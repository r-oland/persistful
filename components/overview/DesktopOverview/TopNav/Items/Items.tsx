// Components==============
import { motion } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
import NewRewardCard from 'global_components/NewRewardCard/NewRewardCard';
import RewardCard from 'global_components/RewardCard/RewardCard';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { framerTopNavChild, framerTopNavParent } from 'utils/framerAnimations';
import { DesktopOverviewContext } from '../../DesktopOverview';
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
  const { activeDay, setActiveDay } = useContext(DesktopOverviewContext);

  return (
    <motion.div variants={framerTopNavChild}>
      <Calendar activeDay={activeDay} setActiveDay={setActiveDay} />
    </motion.div>
  );
}

export default function Items({
  activeReward,
  rewardModalIsOpen,
  setRewardModalIsOpen,
  setIsOpen,
}: {
  activeReward?: RewardEntity;
  rewardModalIsOpen: boolean;
  setRewardModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { activeDay } = useContext(DesktopOverviewContext);

  const ref = useRef(null);

  useOnClickOutside({
    refs: [ref],
    handler: () => setIsOpen(false),
  });

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(1);
    if (key === 0) return;

    setIsOpen(false);
  }, [activeDay]);

  useEffect(() => {
    if (rewardModalIsOpen) setIsOpen(false);
  }, [rewardModalIsOpen]);

  return (
    <motion.div
      initial="hidden"
      exit="hidden"
      animate="show"
      variants={framerTopNavParent}
      className={`${styles.wrapper}`}
      ref={ref}
    >
      <CalendarComp />
      <Reward
        activeReward={activeReward}
        setModalIsOpen={setRewardModalIsOpen}
      />
    </motion.div>
  );
}
