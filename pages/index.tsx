// Components==============
import useAddActivity from 'actions/activity/useAddActivity';
import useDeleteActivity from 'actions/activity/useDeleteActivity';
import useGetActivities from 'actions/activity/useGetActivities';
import useUpdateActivity from 'actions/activity/useUpdateActivity';
import useAddDay from 'actions/day/useAddDay';
import useGetDay from 'actions/day/useGetDay';
import useUpdateDay from 'actions/day/useUpdateDay';
import useAddReward from 'actions/reward/useAddReward';
import useGetRewards from 'actions/reward/useGetRewards';
import useUpdateReward from 'actions/reward/useUpdateReward';
import useGetUser from 'actions/user/useGetUser';
import useUpdateStreak from 'actions/user/useUpdateStreak';
import useUpdateUser from 'actions/user/useUpdateUser';
import styles from 'components/dashboard/Dashboard.module.scss';
import SideBar from 'components/dashboard/SideBar/SideBar';
import TopNav from 'components/dashboard/TopNav/TopNav';
import Button from 'global_components/Button/Button';
import { useMediaQ } from 'hooks/useMediaQ';
import React, { useEffect } from 'react';
// =========================

export default function Dashboard() {
  const query = useMediaQ('min', 768);

  const { data: activities } = useGetActivities();
  const addActivity = useAddActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  const { data: rewards } = useGetRewards();
  const addReward = useAddReward();
  const updateReward = useUpdateReward();

  const { data: user } = useGetUser();
  const updateUser = useUpdateUser();
  const updateStreak = useUpdateStreak(rewards?.[0]?._id);

  const { data: today, isLoading } = useGetDay();
  const addDay = useAddDay();
  const updateDay = useUpdateDay();

  useEffect(() => {
    if (isLoading || !!today) return;

    addDay.mutate();
  }, [!!today, isLoading]);

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
          add activity
        </Button>
        {!!today && (
          <div
            key={today?._id}
            onClick={() =>
              updateDay.mutate({
                id: today?._id,
              })
            }
          >
            {today?.userId}
          </div>
        )}
        <Button
          onClick={() =>
            addReward.mutate({
              image: 'hello',
              name: 'new reward',
              completedCycles: 2,
              totalCycles: 20,
            })
          }
        >
          add reward
        </Button>
        {rewards?.map((reward) => (
          <div
            key={reward._id}
            onClick={() =>
              updateReward.mutate({
                id: reward._id,
                completedCycles: reward.completedCycles + 1,
              })
            }
          >
            {reward.name} {reward.completedCycles}
          </div>
        ))}
        <Button
          onClick={() => updateUser.mutate({ streak: (user?.streak || 0) + 1 })}
        >
          {user?.streak}
        </Button>
        <Button onClick={() => updateStreak.mutate({ direction: 'dec' })}>
          trigger streak update
        </Button>
      </div>
      {query && <SideBar />}
    </div>
  );
}
