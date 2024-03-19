// Components==============
import MobileStats from 'components/progress/MobileStats/MobileStats';
import styles from 'components/progress/Progress.module.scss';
import SideBar from 'components/progress/SideBar/SideBar';
import { endOfToday, startOfToday, subMonths } from 'date-fns';
import TopNav from 'global_components/TopNav/TopNav';
import ProgressStats from 'global_components/Stats/ProgressStats/ProgressStats';
import { useDeepComparison } from 'hooks/useDeepComparison';
import { useMediaQ } from 'hooks/useMediaQ';
import Head from 'next/head';
import React, { createContext, useMemo, useState } from 'react';
import ActivityLineGraph from 'components/progress/ActivityLineGraph/ActivityLineGraph';
import StreakOverview from 'components/progress/StreakOverview/StreakOverview';
// =========================

type ProgressContextType = {
  range: { from: Date; to: Date };
  setRange: React.Dispatch<React.SetStateAction<{ from: Date; to: Date }>>;
  highlightedDay?: Date;
  setHighlightedDay: React.Dispatch<React.SetStateAction<Date | undefined>>;
  scrollRef: React.RefObject<HTMLDivElement>;
};

export const ProgressContext = createContext({} as ProgressContextType);

export default function Progress() {
  const query = useMediaQ('min', 1024);
  const tabletQuery = useMediaQ('min', 768);
  const desktopQuery = useMediaQ('min', 1024);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [range, setRange] = useState<{ from: Date; to: Date }>({
    from: subMonths(startOfToday(), 1),
    to: endOfToday(),
  });

  const [highlightedDay, setHighlightedDay] = useState<Date | undefined>(
    undefined
  );

  const value = useMemo(
    () => ({
      range,
      setRange,
      highlightedDay,
      setHighlightedDay,
      scrollRef,
    }),
    [useDeepComparison(range), highlightedDay, scrollRef]
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
          <div className={styles.content} ref={scrollRef}>
            {tabletQuery && <ProgressStats />}
            {!desktopQuery && <MobileStats />}
            <ActivityLineGraph />
            <StreakOverview />
          </div>
          {query && <SideBar />}
        </div>
      </ProgressContext.Provider>
    </>
  );
}
