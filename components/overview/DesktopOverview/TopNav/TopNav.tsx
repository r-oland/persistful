// Components==============
import { faCalendarDay } from '@fortawesome/pro-regular-svg-icons';
import { faFlame } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import { format } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import RewardModal from 'global_components/RewardModal/RewardModal';
import TopNavWrapper from 'global_components/TopNavWrapper/TopNavWrapper';
import useGetRewardCycles from 'hooks/useGetRewardCycles';
import React, { useContext, useState } from 'react';
import { DesktopOverviewContext } from '../DesktopOverview';
import Items from './Items/Items';
import styles from './TopNav.module.scss';
// =========================

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [rewardModalIsOpen, setRewardModalIsOpen] = useState(false);

  const { activeDay } = useContext(DesktopOverviewContext);

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
        <div
          className={styles.wrapper}
          onClick={() => setIsOpen(true)}
          style={{
            cursor: !isOpen ? 'pointer' : 'default',
          }}
        >
          <div className={styles.date}>
            <FontAwesomeIcon icon={faCalendarDay} />
            <p>{format(activeDay, 'MMMM yyyy')}</p>
          </div>
          <div className={styles.reward}>
            <FontAwesomeIcon icon={faFlame} />
            {!!activeReward && (
              <div
                className={`${styles.counter} ${
                  activeReward?.totalCycles === completedCycles
                    ? styles.completed
                    : ''
                }`}
              >
                <p>{activeReward ? completedCycles : 0}</p>
              </div>
            )}
          </div>
          <AnimatePresence>
            {isOpen && (
              <Items
                setIsOpen={setIsOpen}
                activeReward={activeReward}
                rewardModalIsOpen={rewardModalIsOpen}
                setRewardModalIsOpen={setRewardModalIsOpen}
              />
            )}
          </AnimatePresence>
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
