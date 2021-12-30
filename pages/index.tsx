// Components==============
import useAddActivity from 'actions/activity/useAddActivities';
import useDeleteActivity from 'actions/activity/useDeleteActivity';
import useGetActivities from 'actions/activity/useGetActivities';
import useUpdateActivity from 'actions/activity/useUpdateActivities';
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

  const activities = useGetActivities();
  const addActivity = useAddActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  const user = useGetUser();
  const updateUser = useUpdateUser();

  return (
    <div className={styles.wrapper}>
      {!query && <TopNav />}
      <div className={styles.content}>
        {activities?.map((activity) => (
          <div
            key={activity._id}
            onClick={() =>
              updateActivity.mutate({
                id: activity._id,
                enablePattern: !activity.enablePattern,
              })
            }
            onDoubleClick={() => deleteActivity.mutate(activity._id)}
          >
            {activity.name} {activity.status}{' '}
            {JSON.stringify(activity.enablePattern)}
          </div>
        ))}
        <Button
          onClick={() =>
            addActivity.mutate({
              countMode: 'times',
              icon: 'faUser',
              name: 'A new value',
              status: 'active',
              countCalc: 20,
              enablePattern: true,
              pattern: [{ x: 20, y: 40, r: 80, shape: 'triangle', size: 2 }],
            })
          }
        >
          add item
        </Button>
        <Button
          onClick={() => updateUser.mutate({ streak: (user?.streak || 0) + 1 })}
        >
          {user?.streak}
        </Button>
      </div>
      {query && <SideBar />}
    </div>
  );
}
