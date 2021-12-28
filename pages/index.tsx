// Components==============
import styles from 'components/dashboard/Dashboard.module.scss';
import SideBar from 'components/dashboard/SideBar/SideBar';
import TopNav from 'components/dashboard/TopNav/TopNav';
import { useMediaQ } from 'hooks/useMediaQ';
import React from 'react';
// =========================

export default function Dashboard() {
  const query = useMediaQ('min', 768);

  return (
    <div className={styles.wrapper}>
      {!query && <TopNav />}
      <div className={styles.content} />
      {query && <SideBar />}
    </div>
  );
}
