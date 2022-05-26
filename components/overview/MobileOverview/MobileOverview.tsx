// Components==============
import GeneralTopNav from 'global_components/GeneralTopNav/GeneralTopNav';
import Graph from 'global_components/Graph/Graph';
import ProgressCircle from 'global_components/ProgressCircle/ProgressCircle';
import MobileOverviewStats from 'global_components/Stats/MobileOverviewStats';
import { useMediaQ } from 'hooks/useMediaQ';
import React, { createContext, useMemo, useState } from 'react';
import { getPastDay } from 'utils/getPastDay';
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

  const value = useMemo(() => ({ activeDay, setActiveDay }), [activeDay]);

  // Change it so that it is 6 days in the past. -> not 7 because today also counts
  const lastWeek = getPastDay(activeDay, 6);

  return (
    <MobileOverviewContext.Provider value={value}>
      <div className={styles.wrapper}>
        <GeneralTopNav
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          overview
        />
        {!tabletQuery && <MobileOverviewStats />}
        <div className={styles.content}>
          {tabletQuery && <MobileOverviewStats />}
          <div className={styles.top}>
            <div className={styles['progress-wrapper']}>
              <ProgressCircle range={[lastWeek, activeDay]} />
            </div>
          </div>
          <Graph range={[lastWeek, activeDay]} />
        </div>
      </div>
    </MobileOverviewContext.Provider>
  );
}
