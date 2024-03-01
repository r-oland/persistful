// Components==============
import useGetDays from 'actions/day/useGetDays';
import MobileStats from 'components/progress/MobileStats/MobileStats';
import styles from 'components/progress/Progress.module.scss';
import SideBar from 'components/progress/SideBar/SideBar';
import { endOfMonth, startOfMonth } from 'date-fns';
import GeneralTopNav from 'global_components/GeneralTopNav/GeneralTopNav';
import ProgressStats from 'global_components/Stats/ProgressStats';
import { useDeepComparison } from 'hooks/useDeepComparison';
import { useMediaQ } from 'hooks/useMediaQ';
import Head from 'next/head';
import React, { createContext, useMemo, useState } from 'react';
// =========================

type ProgressContextType = {
  range: Date[];
  setRange: React.Dispatch<React.SetStateAction<Date[]>>;
  isLoading: boolean;
};

export const ProgressContext = createContext({} as ProgressContextType);

export default function Progress() {
  const query = useMediaQ('min', 1024);
  const tabletQuery = useMediaQ('min', 768);
  const desktopQuery = useMediaQ('min', 1024);

  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  const [activeDay, setActiveDay] = useState(new Date());
  const [range, setRange] = useState([start, end]);

  const { isLoading } = useGetDays(range[0], range[1]);

  const value = useMemo(
    () => ({
      range,
      setRange,
      isLoading,
    }),
    [useDeepComparison(range), isLoading]
  );

  return (
    <>
      <Head>
        <title>Progress</title>
      </Head>
      <ProgressContext.Provider value={value}>
        <div className={styles.wrapper}>
          {!query && (
            <GeneralTopNav activeDay={activeDay} setActiveDay={setActiveDay} />
          )}
          {!tabletQuery && <ProgressStats />}
          <div className={styles.content}>
            {tabletQuery && <ProgressStats />}
            {!desktopQuery && <MobileStats />}
          </div>
          {query && <SideBar />}
        </div>
      </ProgressContext.Provider>
    </>
  );
}
