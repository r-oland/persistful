// Components==============
import { faCalendarDay } from '@fortawesome/pro-regular-svg-icons';
import { faCircleArrowDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import TopNavWrapper from 'global_components/TopNavWrapper/TopNavWrapper';
import { useMediaQ } from 'hooks/useMediaQ';
import { handlePwaInstall, PwaInstallContext } from 'hooks/usePwaInstall';
import React, { useContext, useEffect, useState } from 'react';
import { DashboardContext } from 'pages';
import styles from './TopNav.module.scss';
import Items from './Items/Items';
import {
  DashboardRewardCount,
  ProgressRewardCount,
} from './RewardCount/RewardCount';
import ConditionalRewardModal from './ConditionalRewardModal';
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
            {page === 'dashboard' ? (
              <DashboardRewardCount setSelected={setSelected} />
            ) : (
              <ProgressRewardCount setSelected={setSelected} />
            )}
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
      {page === 'dashboard' && (
        <ConditionalRewardModal
          selectedReward={selectedReward}
          setSelectedReward={setSelectedReward}
        />
      )}
    </>
  );
}
