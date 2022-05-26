// Components==============
import useGetRewardsByDays from 'actions/reward/useGetRewardByDays';
import { endOfMonth, startOfMonth } from 'date-fns';
import Graph from 'global_components/Graph/Graph';
import ProgressCircle from 'global_components/ProgressCircle/ProgressCircle';
import DesktopOverviewStats from 'global_components/Stats/DesktopOverviewStats';
import { useMediaQ } from 'hooks/useMediaQ';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import styles from './DesktopOverview.module.scss';
import SideBar from './SideBar/SideBar';
import TopNav from './TopNav/TopNav';
// =========================

type DesktopOverviewContextType = {
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
  rewards: RewardEntity[];
  range: Date[];
  setRange: React.Dispatch<React.SetStateAction<Date[]>>;
};

export const DesktopOverviewContext = createContext(
  {} as DesktopOverviewContextType
);

export default function DesktopOverview() {
  const query = useMediaQ('min', 1500);

  const [activeDay, setActiveDay] = useState<Date>(new Date());

  const start = startOfMonth(activeDay);
  const end = endOfMonth(activeDay);

  const [range, setRange] = useState([start, end]);

  useEffect(() => {
    setRange([start, end]);
  }, [activeDay]);

  const { data: rewards } = useGetRewardsByDays(range[0], range[1], {
    retry: false,
  });

  const value = useMemo(
    () => ({
      activeDay,
      setActiveDay,
      rewards: rewards || [],
      range,
      setRange,
    }),
    [rewards?.length, JSON.stringify(range)]
  );

  return (
    <DesktopOverviewContext.Provider value={value}>
      <div className={styles.wrapper}>
        {!query && <TopNav />}
        <div className={styles.content}>
          <DesktopOverviewStats />
          <div className={styles.top}>
            <div>
              <ProgressCircle range={range} />
            </div>
            <Graph range={range} />
          </div>
        </div>
        {query && <SideBar />}
      </div>
    </DesktopOverviewContext.Provider>
  );
}
