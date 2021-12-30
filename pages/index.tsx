// Components==============
import useGetUser from 'actions/user/useGetUser';
import useUpdateUser from 'actions/user/useUpdateUser';
import styles from 'components/dashboard/Dashboard.module.scss';
import SideBar from 'components/dashboard/SideBar/SideBar';
import TopNav from 'components/dashboard/TopNav/TopNav';
import Button from 'global_components/Button/Button';
import { useMediaQ } from 'hooks/useMediaQ';
import React from 'react';
// =========================

export default function Dashboard() {
  const query = useMediaQ('min', 768);

  const user = useGetUser();
  const updateUser = useUpdateUser();

  return (
    <div className={styles.wrapper}>
      {!query && <TopNav />}
      <div className={styles.content}>
        {user?.streak}
        <Button
          onClick={() => updateUser.mutate({ streak: (user?.streak || 0) + 1 })}
        >
          test button
        </Button>
      </div>
      {query && <SideBar />}
    </div>
  );
}
