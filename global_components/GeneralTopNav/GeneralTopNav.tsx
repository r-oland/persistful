// Components==============
import { faCalendarDay } from '@fortawesome/pro-regular-svg-icons';
import { faCircleArrowDown, faFlame } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetActiveReward from 'actions/reward/useGetActiveReward';
import { format } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import RewardModal from 'global_components/RewardModal/RewardModal';
import TopNavWrapper from 'global_components/TopNavWrapper/TopNavWrapper';
import useGetRewardCycles from 'hooks/useGetRewardCycles';
import { useMediaQ } from 'hooks/useMediaQ';
import { handlePwaInstall, PwaInstallContext } from 'hooks/usePwaInstall';
import React, { useContext, useEffect, useState } from 'react';
import { getStartEndWeek } from 'utils/getStartEndWeek';
import styles from './GeneralTopNav.module.scss';
import Items from './Items/Items';
// =========================

export type TopNavSelectedOption = 'bar' | 'calendar' | 'streak' | 'none';

export default function GeneralTopNav({
  activeDay,
  setActiveDay,
  overview,
}: {
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
  overview?: boolean;
}) {
  const [selected, setSelected] = useState<TopNavSelectedOption>('none');
  const [rewardModalIsOpen, setRewardModalIsOpen] = useState(false);

  // @ts-ignore
  const query = useMediaQ('min', 825);
  const tabletQuery = useMediaQ('min', 768);

  const context = useContext(PwaInstallContext);

  const { deferredPrompt, canShowIosInstall } = context;

  const { data: activeReward } = useGetActiveReward();

  const totalCompleted = useGetRewardCycles(activeReward);

  const completedCycles = activeReward
    ? totalCompleted > activeReward.totalCycles
      ? activeReward?.totalCycles
      : totalCompleted
    : 0;

  useEffect(() => {
    if (selected === 'bar' && !query) return setSelected('none');
    if (selected === 'calendar' || (selected === 'streak' && query))
      return setSelected('none');
  }, [query]);

  const { firstDay, lastDay } = getStartEndWeek(activeDay);

  return (
    <>
      <TopNavWrapper>
        <div
          className={styles.wrapper}
          onClick={query ? () => setSelected('bar') : undefined}
          style={{
            cursor: query && selected === 'none' ? 'pointer' : 'default',
          }}
        >
          <div className={styles.date} onClick={() => setSelected('calendar')}>
            <FontAwesomeIcon icon={faCalendarDay} />
            <p>
              {overview
                ? `${format(firstDay, 'dd MMM')} - ${format(
                    lastDay,
                    'dd MMM '
                  )}`
                : format(activeDay, 'dd MMMM yyyy')}
            </p>
          </div>
          <div className={styles['icon-wrapper']}>
            {!tabletQuery && (deferredPrompt || canShowIosInstall) && (
              <div
                className={styles.reward}
                onClick={() => handlePwaInstall(context)}
              >
                <FontAwesomeIcon icon={faCircleArrowDown} />
                <div
                  className={`${styles.counter} ${styles.completed}`}
                  style={{ left: 13 }}
                >
                  <p>!</p>
                </div>
              </div>
            )}
            <div
              className={styles.reward}
              onClick={() => setSelected('streak')}
            >
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
          </div>
          <AnimatePresence>
            {selected !== 'none' && (
              <Items
                activeReward={activeReward}
                selected={selected}
                setSelected={setSelected}
                rewardModalIsOpen={rewardModalIsOpen}
                setRewardModalIsOpen={setRewardModalIsOpen}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
                overview={overview}
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
