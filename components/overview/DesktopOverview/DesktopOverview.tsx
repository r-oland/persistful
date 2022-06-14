// Components==============
import useGetDays from 'actions/day/useGetDays';
import useGetRewardsByDays from 'actions/reward/useGetRewardByDays';
import { endOfMonth, startOfMonth } from 'date-fns';
import { useDeepComparison } from 'hooks/useDeepComparison';
import { useMediaQ } from 'hooks/useMediaQ';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import styles from './DesktopOverview.module.scss';
import SideBar from './SideBar/SideBar';
import TopNav from './TopNav/TopNav';
import Week from './Weeks/Week/Week';
import Weeks from './Weeks/Weeks';
// =========================

type DesktopOverviewContextType = {
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
  rewards: RewardEntity[];
  range: Date[];
  setRange: React.Dispatch<React.SetStateAction<Date[]>>;
  isLoading: boolean;
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

  // retry = false because days range can be selected that doesn't exists. This prevents it from trying to query in it on fail
  const { data: days, isLoading } = useGetDays(range[0], range[1], {
    retry: false,
  });

  const value = useMemo(
    () => ({
      activeDay,
      setActiveDay,
      rewards: rewards || [],
      range,
      setRange,
      isLoading,
    }),
    [rewards?.length, useDeepComparison(range), isLoading]
  );

  return (
    <DesktopOverviewContext.Provider value={value}>
      <div className={styles.wrapper}>
        {!query && <TopNav />}
        <div className={styles.content}>
          <Week days={days} sum />
          <Weeks days={days} />
        </div>
        {query && <SideBar />}
      </div>
    </DesktopOverviewContext.Provider>
  );
}
