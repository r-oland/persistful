// Components==============
import Activities from 'components/dashboard/Activities/Activities';
import styles from 'components/dashboard/Dashboard.module.scss';
import SideBar from 'components/dashboard/SideBar/SideBar';
import TopNav from 'components/dashboard/TopNav/TopNav';
import ProgressCircle from 'global_components/ProgressCircle/ProgressCircle';
import ValidateEffect from 'global_components/ValidateEffect';
import useGetDashboardSentence from 'hooks/useGetDashboardSentence';
import { useMediaQ } from 'hooks/useMediaQ';
import Head from 'next/head';
import React from 'react';
// =========================

export default function Dashboard() {
  const query = useMediaQ('min', 1500);
  // @ts-ignore
  const desktopQuery = useMediaQ('min', 1175);

  const sentence = useGetDashboardSentence();

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className={styles.wrapper}>
        {!query && <TopNav />}
        <div className={styles.content}>
          <div className={styles['title-wrapper']}>
            <h1 className={styles.title}>{sentence}</h1>
          </div>
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
    </>
  );
}
