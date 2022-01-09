// Components==============
import useGetActivities from 'actions/activity/useGetActivities';
import ActivityCard from 'global_components/ActivityCard/ActivityCard';
import NewActivity from 'global_components/ActivityCard/NewActivity';
import { ActivitiesContext } from 'pages/activities';
import React, { useContext } from 'react';
import styles from './LeftSidebar.module.scss';
// =========================

export default function LeftSidebar() {
  const { data: activities } = useGetActivities();
  const { setSelectedActivity, selectedActivity } =
    useContext(ActivitiesContext);

  return (
    <div className={styles.wrapper}>
      <NewActivity />
      {activities
        ?.filter((a) => a.status !== 'deleted')
        ?.map((a) => (
          <ActivityCard
            activity={a}
            key={a._id}
            onClick={() => setSelectedActivity(a._id)}
            selected={selectedActivity === a._id}
            activities={activities}
          />
        ))}
    </div>
  );
}
