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
import { useMediaQ } from 'hooks/useMediaQ';
import React, { useEffect, useState } from 'react';
import { getPastDay } from 'utils/getPastDay';
import Items from './Items/Items';
import styles from './GeneralTopNav.module.scss';
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

  const lastWeek = getPastDay(activeDay, 6);

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
                ? `${format(lastWeek, 'dd MMM')} - ${format(
                    activeDay,
                    'dd MMM '
                  )}`
                : format(activeDay, 'dd MMMM yyyy')}
            </p>
          </div>
          <div className={styles.reward} onClick={() => setSelected('streak')}>
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
            {selected !== 'none' && (
              <Items
                activeReward={activeReward}
                selected={selected}
                setSelected={setSelected}
                rewardModalIsOpen={rewardModalIsOpen}
                setRewardModalIsOpen={setRewardModalIsOpen}
                activeDay={activeDay}
                setActiveDay={setActiveDay}
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
