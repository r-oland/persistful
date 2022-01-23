// Components==============
import useGetActivities from 'actions/activity/useGetActivities';
import ActivityCard from 'global_components/ActivityCard/ActivityCard';
import NewActivity from 'global_components/ActivityCard/NewActivity';
import { useMediaQ } from 'hooks/useMediaQ';
import { useRouter } from 'next/router';
import { ActivitiesContext } from 'pages/activities';
import React, { useContext } from 'react';
import styles from './LeftSidebar.module.scss';
// =========================

export default function LeftSidebar() {
  const { data: activities } = useGetActivities();
  const { setSelectedActivity, selectedActivity } =
    useContext(ActivitiesContext);

  const { push } = useRouter();
  const query = useMediaQ('min', 1024);

  return (
    <div className={styles.wrapper}>
      {!query && (
        <div>
          <h2 className={styles.title}>Activities</h2>
        </div>
      )}
      <div className={styles.content}>
        <NewActivity />
        {activities
          ?.filter((a) => a.status !== 'deleted')
          ?.map((a) => (
            <ActivityCard
              activity={a}
              key={a._id}
              onClick={() =>
                query ? setSelectedActivity(a._id) : push(`/activity/${a._id}`)
              }
              selected={selectedActivity === a._id}
              activities={activities}
            />
          ))}
      </div>
    </div>
  );
}
