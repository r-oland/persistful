// Components==============
import { motion } from 'framer-motion';
import OverviewCalendar from 'global_components/Calendar/OverviewCalendar';
import RewardCard from 'global_components/RewardCard/RewardCard';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { useContext, useRef } from 'react';
import { framerTopNavChild, framerTopNavParent } from 'utils/framerAnimations';
import { DesktopOverviewContext } from '../../DesktopOverview';
import styles from './Items.module.scss';
// =========================

function RewardsComp() {
  const { rewards } = useContext(DesktopOverviewContext);

  return (
    <motion.div className={styles.reward} variants={framerTopNavChild}>
      <h3 className={styles.title}>
        Earned reward{rewards.length === 1 ? '' : 's'}
      </h3>
      {rewards.length ? (
        <div className={styles['scroll-wrapper']}>
          <div className={styles['reward-wrapper']}>
            {rewards.map((r) => (
              <RewardCard reward={r} key={r._id} />
            ))}
          </div>
        </div>
      ) : (
        <p className={styles['no-rewards']}>
          It seems that you did not earn any rewards during this period of time.
        </p>
      )}
    </motion.div>
  );
}

function CalendarComp() {
  return (
    <motion.div variants={framerTopNavChild}>
      <OverviewCalendar />
    </motion.div>
  );
}

export default function Items({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const ref = useRef(null);

  useOnClickOutside({
    refs: [ref],
    handler: () => setIsOpen(false),
  });

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
