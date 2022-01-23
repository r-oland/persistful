// Components==============
import { faCalendarDay } from '@fortawesome/pro-regular-svg-icons';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import { AnimatePresence, motion } from 'framer-motion';
import TopNavWrapper from 'global_components/LayoutWrappers/TopNavWrapper/TopNavWrapper';
import NewRewardCard from 'global_components/NewRewardCard/NewRewardCard';
import RewardCard from 'global_components/RewardCard/RewardCard';
import RewardModal from 'global_components/RewardModal/RewardModal';
import useGetRewardCycles from 'hooks/useGetRewardCycles';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { useRef, useState } from 'react';
import { framerFade } from 'utils/framerAnimations';
import { getMonthString } from 'utils/getMonthString';
import styles from './TopNav.module.scss';
// =========================

function RewardTooltip({
  activeReward,
  setTooltipIsOpen,
  setModalIsOpen,
  buttonRef,
}: {
  activeReward?: RewardEntity;
  setTooltipIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.RefObject<HTMLDivElement>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside({
    refs: [ref, buttonRef],
    handler: () => setTooltipIsOpen(false),
  });

  return (
    <motion.div {...framerFade} className={styles['reward-tooltip']} ref={ref}>
      {activeReward ? (
        <RewardCard reward={activeReward} setModalIsOpen={setModalIsOpen} />
      ) : (
        <NewRewardCard setModalIsOpen={setModalIsOpen} />
      )}
    </motion.div>
  );
}

export default function TopNav() {
  const today = new Date();
  const day = today.getDate();
  const month = getMonthString(today.getMonth());
  const year = today.getUTCFullYear();

  const ref = useRef<HTMLDivElement>(null);

  const [rewardModalIsOpen, setRewardModalIsOpen] = useState(false);
  const [rewardTooltipIsOpen, setRewardTooltipIsOpen] = useState(false);

  const { data: activeReward } = useGetActiveReward();

  const totalCompleted = useGetRewardCycles(activeReward);

  const completedCycles = activeReward
    ? totalCompleted > activeReward.totalCycles
      ? activeReward?.totalCycles
      : totalCompleted
    : 0;

  return (
    <>
      <TopNavWrapper>
        <div className={styles.wrapper}>
          <div className={styles.date}>
            <FontAwesomeIcon icon={faCalendarDay} />
            <p>
              {day} {month} {year}
            </p>
          </div>
          <div className={styles.reward}>
            <div
              onClick={() => setRewardTooltipIsOpen((prev) => !prev)}
              ref={ref}
            >
              <FontAwesomeIcon icon={faFlame} />
              <div
                className={`${styles.counter} ${
                  activeReward?.totalCycles === completedCycles
                    ? styles.completed
                    : ''
                }`}
              >
                <p>{activeReward ? completedCycles : 0}</p>
              </div>
            </div>
            <AnimatePresence>
              {rewardTooltipIsOpen && (
                <RewardTooltip
                  activeReward={activeReward}
                  setTooltipIsOpen={setRewardTooltipIsOpen}
                  setModalIsOpen={setRewardModalIsOpen}
                  buttonRef={ref}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </TopNavWrapper>
      <AnimatePresence>
        {rewardModalIsOpen && (
          <RewardModal
            setModalIsOpen={setRewardModalIsOpen}
            reward={activeReward}
          />
        )}
      </AnimatePresence>
    </>
  );
}
