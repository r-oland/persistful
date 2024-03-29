// Components==============
import useGetDays from 'actions/day/useGetDays';
import useGetUser from 'actions/user/useGetUser';
import Activities from 'components/dashboard/Activities/Activities';
import styles from 'components/dashboard/Dashboard.module.scss';
import SideBar from 'components/dashboard/SideBar/SideBar';
import ValidateEffect from 'components/dashboard/ValidateEffect';
import { AnimatePresence } from 'framer-motion';
import TopNav from 'global_components/TopNav/TopNav';
import Graph from 'global_components/Graph/Graph';
import OnboardingModal from 'global_components/OnboardingModal/OnboardingModal';
import CompletedRewardModal from 'global_components/CompletedRewardModal/CompletedRewardModal';
import ProgressCircle from 'global_components/ProgressCircle/ProgressCircle';
import DashboardStats from 'global_components/Stats/DashboardStats';
import { useMediaQ } from 'hooks/useMediaQ';
import Head from 'next/head';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
import { getStartEndWeek } from 'utils/getStartEndWeek';
// =========================

type DashboardContextType = {
  setInvalidateActivitiesQuery: React.Dispatch<React.SetStateAction<boolean>>;
  setCompletedRewardModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
};

export const DashboardContext = createContext({} as DashboardContextType);

export default function Dashboard() {
  const [invalidateActivitiesQuery, setInvalidateActivitiesQuery] =
    useState(false);

  const [onboardingModalIsOpen, setOnboardingModalIsOpen] = useState(false);
  const [completedRewardModalIsOpen, setCompletedRewardModalIsOpen] =
    useState(false);

  const query = useMediaQ('min', 1500);
  // @ts-ignore
  const desktopQuery = useMediaQ('min', 1175);
  const tabletQuery = useMediaQ('min', 768);

  const queryClient = useQueryClient();

  const [activeDay, setActiveDay] = useState<Date>(new Date());

  const { firstDay, lastDay } = getStartEndWeek(activeDay);

  const { data: days, isLoading } = useGetDays(firstDay, lastDay);

  const { data: user } = useGetUser();

  // Invalidate query if user updated on of day activities and goes to another page
  useEffect(
    () => () => {
      if (invalidateActivitiesQuery)
        queryClient.invalidateQueries('activities');
    },
    [invalidateActivitiesQuery]
  );

  useEffect(() => {
    if (user && !user.finishedOnboarding) return setOnboardingModalIsOpen(true);
  }, [user?.finishedOnboarding]);

  const value = useMemo(
    () => ({
      setInvalidateActivitiesQuery,
      setCompletedRewardModalIsOpen,
      activeDay,
      setActiveDay,
    }),
    [activeDay]
  );

  return (
    <DashboardContext.Provider value={value}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className={styles.wrapper}>
        {!query && <TopNav page="dashboard" />}
        {!tabletQuery && <DashboardStats />}
        <div className={styles.content}>
          {tabletQuery && <DashboardStats />}
          <div className={styles.top}>
            <div className={styles['progress-wrapper']}>
              <ProgressCircle activeDay={activeDay} />
            </div>
            {desktopQuery && <Graph days={days} isLoading={isLoading} />}
          </div>
          <Activities />
        </div>
        {query && <SideBar />}
        <ValidateEffect />
      </div>
      <AnimatePresence>
        {onboardingModalIsOpen && (
          <OnboardingModal setModalIsOpen={setOnboardingModalIsOpen} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {completedRewardModalIsOpen && (
          <CompletedRewardModal
            setModalIsOpen={setCompletedRewardModalIsOpen}
          />
        )}
      </AnimatePresence>
    </DashboardContext.Provider>
  );
}
