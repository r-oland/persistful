// Components==============
import styles from 'components/activities/activities.module.scss';
import EditView from 'components/activities/EditView/EditView';
import LeftSidebar from 'components/activities/LeftSidebar/LeftSidebar';
import TopBar from 'components/activities/TopBar/TopBar';
import { useMediaQ } from 'hooks/useMediaQ';
import Head from 'next/head';
import React, { createContext, useMemo, useState } from 'react';
// =========================

type ActivitiesContextType = {
  selectedActivity: string;
  setSelectedActivity: React.Dispatch<React.SetStateAction<string>>;
};

export const ActivitiesContext = createContext({} as ActivitiesContextType);

export default function Activities() {
  const [selectedActivity, setSelectedActivity] = useState('new-activity');

  const memorizedValues = useMemo(
    () => ({ selectedActivity, setSelectedActivity }),
    [selectedActivity]
  );

  const query = useMediaQ('min', 1024);

  return (
    <>
      <Head>
        <title>Activities</title>
      </Head>
      <ActivitiesContext.Provider value={memorizedValues}>
        <div className={styles.wrapper}>
          {query && <TopBar />}
          <div className={styles.content}>
            <LeftSidebar />
            {query && <EditView key={selectedActivity} />}
          </div>
        </div>
      </ActivitiesContext.Provider>
    </>
  );
}
