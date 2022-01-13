// Components==============
import Activities from 'components/dashboard/Activities/Activities';
import styles from 'components/dashboard/Dashboard.module.scss';
import SideBar from 'components/dashboard/SideBar/SideBar';
import TopNav from 'components/dashboard/TopNav/TopNav';
import ProgressCircle from 'global_components/ProgressCircle/ProgressCircle';
import ValidateEffect from 'global_components/ValidateEffect';
import { useMediaQ } from 'hooks/useMediaQ';
import React from 'react';
// =========================

const sentence = 'Yeez, bit of an overachiever are we?';

export default function Dashboard() {
  const query = useMediaQ('min', 768);

  return (
    <div className={styles.wrapper}>
      {!query && <TopNav />}
      <div className={styles.content}>
        <div>
          <h1 className={styles.title}>{sentence}</h1>
        </div>
        <ProgressCircle />
        <Activities />
      </div>
      {query && <SideBar />}
      <ValidateEffect />
    </div>
  );
}
