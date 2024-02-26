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
import styles from './GeneralTopNav.module.scss';
import Items from './Items/Items';
// =========================

export type TopNavSelectedOption = 'bar' | 'calendar' | 'streak' | 'none';

export default function GeneralTopNav({
  activeDay,
  setActiveDay,
}: {
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const [selected, setSelected] = useState<TopNavSelectedOption>('none');
  const [selectedReward, setSelectedReward] = useState('initial');

  // @ts-ignore
  const query = useMediaQ('min', 850);
  const tabletQuery = useMediaQ('min', 768);

  const context = useContext(PwaInstallContext);

  const { deferredPrompt, canShowIosInstall } = context;

  const { data: openRewards } = useGetOpenRewards();
  const { data: user } = useGetUser();

  const activeReward = openRewards?.find((or) => or._id === user?.activeReward);

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
            <p>{format(activeDay, 'dd MMMM yyyy')}</p>
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
              {!!activeReward && (
                <div
                  className={`${styles.counter} ${
                    activeReward?.totalCycles === activeReward?.completedCycles
                      ? styles.completed
                      : ''
                  }`}
                >
                  <p>{activeReward?.completedCycles || 0}</p>
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
                activeDay={activeDay}
                setActiveDay={setActiveDay}
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
