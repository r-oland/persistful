// Components==============
import useGetActivities from 'actions/activity/useGetActivities';
import Content from 'components/activities/EditView/Content';
import styles from 'components/activity/Activity.module.scss';
import TopNav from 'components/activity/TopNav/TopNav';
import { useMediaQ } from 'hooks/useMediaQ';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
// =========================

export default function Reward() {
  const id = useRouter().query.activityId as string;
  const { push } = useRouter();
  const query = useMediaQ('min', 1024);

  const { data: activities } = useGetActivities();
  const newActivity = id === 'new';
  const activity = activities?.find((a) => id === a._id);

  const [isToggled, setIsToggled] = useState(
    newActivity ? false : activity?.status === 'active'
  );

  useEffect(() => {
    if (query) push('/activities');
    if (id !== 'new' && !activity) push('/activities');
  }, [query]);

  return (
    <div className={styles.wrapper}>
      <TopNav />
      <div className={styles.content}>
        <Content
          activity={activity}
          isToggled={isToggled}
          setIsToggled={setIsToggled}
          handleSwitch={() => push('/activities')}
        />
      </div>
    </div>
  );
}
