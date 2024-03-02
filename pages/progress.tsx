// Components==============
import MobileStats from 'components/progress/MobileStats/MobileStats';
import styles from 'components/progress/Progress.module.scss';
import SideBar from 'components/progress/SideBar/SideBar';
import { endOfToday, startOfToday, subMonths } from 'date-fns';
import TopNav from 'global_components/TopNav/TopNav';
import ProgressStats from 'global_components/Stats/ProgressStats';
import { useDeepComparison } from 'hooks/useDeepComparison';
import { useMediaQ } from 'hooks/useMediaQ';
import Head from 'next/head';
import React, { createContext, useMemo, useState } from 'react';
// =========================

type ProgressContextType = {
  range: { from: Date; to: Date };
  setRange: React.Dispatch<React.SetStateAction<{ from: Date; to: Date }>>;
};

export const ProgressContext = createContext({} as ProgressContextType);

export default function Progress() {
  const query = useMediaQ('min', 1024);
  const tabletQuery = useMediaQ('min', 768);
  const desktopQuery = useMediaQ('min', 1024);

  const [range, setRange] = useState<{ from: Date; to: Date }>({
    from: subMonths(startOfToday(), 1),
    to: endOfToday(),
  });

  const value = useMemo(
    () => ({
      range,
      setRange,
    }),
    [useDeepComparison(range)]
  );

  return (
    <>
      <Head>
        <title>Progress</title>
      </Head>
      <ProgressContext.Provider value={value}>
        <div className={styles.wrapper}>
          {!query && <TopNav page="progress" />}
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
