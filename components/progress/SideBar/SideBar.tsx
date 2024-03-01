// Components==============
import RewardCard from 'global_components/RewardCard/RewardCard';
import React, { useContext, useState } from 'react';
import useGetRewardsByDays from 'actions/reward/useGetRewardByDays';
import { ProgressContext } from 'pages/progress';
import Calendar from 'global_components/Calendar/Calendar';
import styles from './SideBar.module.scss';
import StartEndDate from './StartEndDate/StartEndDate';
import QuickDateSelect from '../QuickDateSelect/QuickDateSelect';
// =========================

export default function SideBar() {
  const { range } = useContext(ProgressContext);
  const { data: rewards } = useGetRewardsByDays(range[0], range[1], {
    retry: false,
  });

  const [activeDay, setActiveDay] = useState(new Date());

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles['start-end-date']}>
            <StartEndDate />
          </div>
          <div className={styles['quick-date-select']}>
            <QuickDateSelect />
          </div>
          <div className={styles.calendar}>
            <Calendar activeDay={activeDay} setActiveDay={setActiveDay} />
          </div>
          <div className={styles['rewards-section']}>
            <h3 className={styles.title}>Rewards</h3>
            {!!rewards?.length && (
              <>
                <div className={`${styles.rewards} `}>
                  {rewards?.map((reward) => (
                    <RewardCard key={reward._id} reward={reward} />
                  ))}
                </div>
                {!!(rewards.length > 2) && <div className={styles.bar} />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
