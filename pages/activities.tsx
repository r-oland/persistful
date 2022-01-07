// Components==============
import LeftSidebar from 'components/activities/LeftSidebar/LeftSidebar';
import React, { createContext, useMemo, useState } from 'react';
import styles from 'components/activities/activities.module.scss';
import EditView from 'components/activities/EditView/EditView';
import TopBar from 'components/activities/TopBar/TopBar';
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

  return (
    <ActivitiesContext.Provider value={memorizedValues}>
      <div className={styles.wrapper}>
        <TopBar />
        <div className={styles.content}>
          <LeftSidebar />
          <EditView key={selectedActivity} />
        </div>
      </div>
    </ActivitiesContext.Provider>
  );
}
