// Components==============
import { faCalendarDay } from '@fortawesome/pro-regular-svg-icons';
import { faCircleArrowDown, faGift } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetOpenRewards from 'actions/reward/useGetOpenRewards';
import { format } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import RewardModal from 'global_components/RewardModal/RewardModal';
import TopNavWrapper from 'global_components/TopNavWrapper/TopNavWrapper';
import { useMediaQ } from 'hooks/useMediaQ';
import { handlePwaInstall, PwaInstallContext } from 'hooks/usePwaInstall';
import React, { useContext, useEffect, useState } from 'react';
import useGetUser from 'actions/user/useGetUser';
import { DashboardContext } from 'pages';
import useGetProgressRewards from 'actions/reward/useGetProgressRewards';
import styles from './TopNav.module.scss';
import Items from './Items/Items';
// =========================

export type TopNavSelectedOption = 'bar' | 'calendar' | 'streak' | 'none';

export default function TopNav({ page }: { page: 'dashboard' | 'progress' }) {
  const [selected, setSelected] = useState<TopNavSelectedOption>('none');
  const [selectedReward, setSelectedReward] = useState('initial');

  // @ts-ignore
  const query = useMediaQ('min', 850);
  const tabletQuery = useMediaQ('min', 768);

  const context = useContext(PwaInstallContext);
  const { activeDay } = useContext(DashboardContext);

  const { deferredPrompt, canShowIosInstall } = context;

  const { data: openRewards } = useGetOpenRewards({
    enabled: page === 'dashboard',
  });
  const { data: progressRewards } = useGetProgressRewards({
    enabled: page === 'progress',
  });
  const { data: user } = useGetUser();

  const activeReward = openRewards?.find((or) => or._id === user?.activeReward);

  const rewardCountCondition =
    page === 'dashboard' ? !!activeReward : progressRewards?.length;
  const rewardCountCompleted =
    page === 'dashboard' &&
    activeReward?.completedCycles === activeReward?.totalCycles;
  const rewardCount =
    page === 'dashboard'
      ? activeReward?.completedCycles
      : progressRewards?.length || 0;

  useEffect(() => {
    if (selected === 'bar' && !query) return setSelected('none');
    if (selected === 'calendar' || (selected === 'streak' && query))
      return setSelected('none');
  }, [query]);

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
            {page === 'dashboard' && <p>{format(activeDay, 'dd MMMM yyyy')}</p>}
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
              <FontAwesomeIcon icon={faGift} />
              {rewardCountCondition && (
                <div
                  className={`${styles.counter} ${
                    rewardCountCompleted ? styles.completed : ''
                  }`}
                >
                  <p>{rewardCount}</p>
                </div>
              )}
            </div>
          </div>
          <AnimatePresence>
            {selected !== 'none' && (
              <Items
                selected={selected}
                setSelected={setSelected}
                selectedReward={selectedReward}
                setSelectedReward={setSelectedReward}
                page={page}
              />
            )}
          </AnimatePresence>
        </div>
      </TopNavWrapper>
      <AnimatePresence>
        {selectedReward !== 'initial' && (
          <RewardModal
            setSelectedReward={setSelectedReward}
            reward={openRewards?.find((or) => or._id === selectedReward)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
