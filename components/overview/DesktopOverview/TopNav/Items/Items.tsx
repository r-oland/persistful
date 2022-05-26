// Components==============
import { motion } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
import RewardCard from 'global_components/RewardCard/RewardCard';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { framerTopNavChild, framerTopNavParent } from 'utils/framerAnimations';
import { DesktopOverviewContext } from '../../DesktopOverview';
import styles from './Items.module.scss';
// =========================

function RewardsComp() {
  const { rewards } = useContext(DesktopOverviewContext);

  return (
    <motion.div className={styles.reward} variants={framerTopNavChild}>
      <h3 className={styles.title}>
        Earned reward{rewards.length > 1 ? 's' : ''}
      </h3>
      <div className={styles['scroll-wrapper']}>
        <div className={styles['reward-wrapper']}>
          {rewards.map((r) => (
            <RewardCard reward={r} key={r._id} overview />
          ))}
        </div>
      </div>
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
  setIsOpen,
}: {
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
      <RewardsComp />
    </motion.div>
  );
}
