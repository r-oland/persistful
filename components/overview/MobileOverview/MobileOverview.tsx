// Components==============
import useGetDays from 'actions/day/useGetDays';
import GeneralTopNav from 'global_components/GeneralTopNav/GeneralTopNav';
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

  // retry = false because days range can be selected that doesn't exists. This prevents it from trying to query in it on fail
  const { data: days, isLoading } = useGetDays(firstDay, lastDay, {
    retry: false,
  });

  const value = useMemo(() => ({ activeDay, setActiveDay }), [activeDay]);

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
              <ProgressCircle days={days || []} />
            </div>
          </div>
          <Graph days={days} isLoading={isLoading} />
        </div>
      </div>
    </MobileOverviewContext.Provider>
  );
}
