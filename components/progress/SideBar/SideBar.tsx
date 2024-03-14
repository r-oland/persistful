// Components==============
import RewardCard from 'global_components/RewardCard/RewardCard';
import React, { useContext } from 'react';
import { ProgressContext } from 'pages/progress';
import RangeCalendar from 'global_components/Calendar/RangeCalendar';
import useGetProgressRewards from 'actions/reward/useGetProgressRewards';
import styles from './SideBar.module.scss';
import StartEndDate from './StartEndDate/StartEndDate';
import QuickDateSelect from '../QuickDateSelect/QuickDateSelect';
// =========================

export default function SideBar() {
  const { range, setRange, highlightedDay } = useContext(ProgressContext);
  const { data: rewards } = useGetProgressRewards({
    retry: false,
  });

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles['date-section']}>
            <div className={styles['start-end-date']}>
              <StartEndDate />
            </div>
            <div className={styles['quick-date-select']}>
              <QuickDateSelect />
            </div>
            <div className={styles.bar} />
            <div className={styles.calendar}>
              <RangeCalendar
                range={range}
                setRange={setRange}
                highlightedDay={highlightedDay}
              />
            </div>
          </div>
          <div className={styles['rewards-section']}>
            <h3 className={styles.title}>Earned Rewards</h3>
            {rewards?.length ? (
              <>
                <div className={`${styles.rewards} `}>
                  {rewards?.map((reward) => (
                    <RewardCard key={reward._id} reward={reward} />
                  ))}
                </div>
                {!!(rewards.length > 2) && <div className={styles.bar} />}
              </>
            ) : (
              <p className={styles['no-rewards']}>
                It seems that you did not earn any rewards during this period of
                time.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
