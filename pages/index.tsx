// Components==============
import Activities from 'components/dashboard/Activities/Activities';
import styles from 'components/dashboard/Dashboard.module.scss';
import SideBar from 'components/dashboard/SideBar/SideBar';
import Stats from 'components/dashboard/Stats/Stats';
import TopNav from 'components/dashboard/TopNav/TopNav';
import ProgressCircle from 'global_components/ProgressCircle/ProgressCircle';
import ValidateEffect from 'global_components/ValidateEffect';
import { useMediaQ } from 'hooks/useMediaQ';
import Head from 'next/head';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
// =========================

type DashboardContextType = {
  setInvalidateActivitiesQuery: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DashboardContext = createContext({} as DashboardContextType);

export default function Dashboard() {
  const [invalidateActivitiesQuery, setInvalidateActivitiesQuery] =
    useState(false);

  const query = useMediaQ('min', 1500);
  // @ts-ignore
  const desktopQuery = useMediaQ('min', 1175);
  const tabletQuery = useMediaQ('min', 768);

  const queryClient = useQueryClient();

  // Invalidate query if user updated on of day activities and goes to another page
  useEffect(
    () => () => {
      if (invalidateActivitiesQuery)
        queryClient.invalidateQueries('activities');
    },
    [invalidateActivitiesQuery]
  );

  const value = useMemo(() => ({ setInvalidateActivitiesQuery }), []);

  return (
    <DashboardContext.Provider value={value}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className={styles.wrapper}>
        {!query && <TopNav />}
        {!tabletQuery && <Stats />}
        <div className={styles.content}>
          {tabletQuery && <Stats />}
          <div className={styles.top}>
            <div className={styles['progress-wrapper']}>
              <ProgressCircle />
            </div>
            {desktopQuery && <div className={styles.graph} />}
          </div>
          <Activities />
        </div>
        {query && <SideBar />}
        <ValidateEffect />
      </div>
    </DashboardContext.Provider>
  );
}
