// Components==============
import Activities from 'components/dashboard/Activities/Activities';
import styles from 'components/dashboard/Dashboard.module.scss';
import Graph from 'components/dashboard/Graph/Graph';
import SideBar from 'components/dashboard/SideBar/SideBar';
import ValidateEffect from 'components/dashboard/ValidateEffect';
import GeneralTopNav from 'global_components/GeneralTopNav/GeneralTopNav';
import ProgressCircle from 'global_components/ProgressCircle/ProgressCircle';
import DashboardStats from 'global_components/Stats/DashboardStats';
import { useMediaQ } from 'hooks/useMediaQ';
import Head from 'next/head';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
// =========================

type DashboardContextType = {
  setInvalidateActivitiesQuery: React.Dispatch<React.SetStateAction<boolean>>;
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
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

  const [activeDay, setActiveDay] = useState<Date>(new Date());

  const value = useMemo(
    () => ({ setInvalidateActivitiesQuery, activeDay, setActiveDay }),
    [activeDay]
  );

  return (
    <DashboardContext.Provider value={value}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className={styles.wrapper}>
        {!query && (
          <GeneralTopNav activeDay={activeDay} setActiveDay={setActiveDay} />
        )}
        {!tabletQuery && <DashboardStats />}
        <div className={styles.content}>
          {tabletQuery && <DashboardStats />}
          <div className={styles.top}>
            <div className={styles['progress-wrapper']}>
              <ProgressCircle activeDay={activeDay} />
            </div>
            {desktopQuery && <Graph />}
          </div>
          <Activities />
        </div>
        {query && <SideBar />}
        <ValidateEffect />
      </div>
    </DashboardContext.Provider>
  );
}
