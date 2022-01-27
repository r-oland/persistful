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

function Activities({
  activities,
  allActivities,
  query,
}: {
  activities?: ActivityEntity[];
  allActivities?: ActivityEntity[];
  query: boolean;
}) {
  const { setSelectedActivity, selectedActivity } =
    useContext(ActivitiesContext);

  const { push } = useRouter();

  if (!activities?.length) return <></>;

  return (
    <>
      {activities
        ?.filter((a) => a.status !== 'deleted')
        .map((a) => (
          <ActivityCard
            activity={a}
            key={a._id}
            onClick={() =>
              query ? setSelectedActivity(a._id) : push(`/activity/${a._id}`)
            }
            selected={selectedActivity === a._id}
            activities={allActivities}
          />
        ))}
    </>
  );
}

export default function LeftSidebar() {
  const query = useMediaQ('min', 1024);

  const { data: allActivities } = useGetActivities();

  const activities = allActivities?.filter((a) => !a.penalty);
  const penalties = allActivities?.filter((a) => a.penalty);

  return (
    <div className={styles.wrapper}>
      {!query && (
        <div>
          <h2 className={styles.title}>Activities</h2>
        </div>
      )}
      <div className={styles.content}>
        <NewActivity />
        <Activities
          activities={activities}
          allActivities={allActivities}
          query={query}
        />
        <Activities
          activities={penalties}
          allActivities={allActivities}
          query={query}
        />
      </div>
    </div>
  );
}
