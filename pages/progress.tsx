// Components==============
import useGetDays from 'actions/day/useGetDays';
import styles from 'components/progress/Progress.module.scss';
import SideBar from 'components/progress/SideBar/SideBar';
import { endOfMonth, startOfMonth } from 'date-fns';
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
  const query = useMediaQ('min', 1500);

  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  const [range, setRange] = useState([start, end]);

  // retry = false because days range can be selected that doesn't exists. This prevents it from trying to query in it on fail
  const { data: days, isLoading } = useGetDays(range[0], range[1], {
    retry: false,
  });

  console.log(days);

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
          <div className={styles.content}>
            <h1>Progress</h1>
          </div>
          {query && <SideBar />}
        </div>
      </ProgressContext.Provider>
    </>
  );
}
