// Components==============
import useGetDays from 'actions/day/useGetDays';
import TopNav from 'global_components/TopNav/TopNav';
import Graph from 'global_components/Graph/Graph';
import ProgressCircle from 'global_components/ProgressCircle/ProgressCircle';
import MobileOverviewStats from 'global_components/Stats/MobileOverviewStats';
import { useMediaQ } from 'hooks/useMediaQ';
import React, { createContext, useMemo, useState } from 'react';
import { getStartEndWeek } from 'utils/getStartEndWeek';
import styles from './MobileOverview.module.scss';
// =========================

type MobileOverviewContextType = {
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
};

export const MobileOverviewContext = createContext(
  {} as MobileOverviewContextType
);

export default function MobileOverview() {
  const [activeDay, setActiveDay] = useState<Date>(new Date());

  const tabletQuery = useMediaQ('min', 768);

  const { firstDay, lastDay } = getStartEndWeek(activeDay);

  const { data: days, isLoading } = useGetDays(firstDay, lastDay);

  const value = useMemo(() => ({ activeDay, setActiveDay }), [activeDay]);

  return (
    <MobileOverviewContext.Provider value={value}>
      <div className={styles.wrapper}>
        <TopNav activeDay={activeDay} setActiveDay={setActiveDay} />
        {!tabletQuery && <MobileOverviewStats />}
        <div className={styles.content}>
          {tabletQuery && <MobileOverviewStats />}
          <div className={styles.top}>
            <div className={styles['progress-wrapper']}>
              <ProgressCircle days={days || []} />
            </div>
          </div>
          <Graph days={days} isLoading={isLoading} />
        </div>
      </div>
    </MobileOverviewContext.Provider>
  );
}
