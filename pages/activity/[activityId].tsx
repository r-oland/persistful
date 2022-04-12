// Components==============
import useGetActivities from 'actions/activity/useGetActivities';
import Content from 'components/activities/EditView/Content';
import DeleteConfirmModal from 'components/activities/DeleteConfirmModal/DeleteConfirmModal';
import styles from 'components/activity/Activity.module.scss';
import TopNav from 'components/activity/TopNav/TopNav';
import { AnimatePresence } from 'framer-motion';
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

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  useEffect(() => {
    if (query) push('/activities');
    if (id !== 'new' && !activity) push('/activities');
  }, [query]);

  const handleSwitch = () => push('/activities');

  return (
    <>
      <div className={styles.wrapper}>
        <TopNav />
        <div className={styles.content}>
          <Content
            activity={activity}
            isToggled={isToggled}
            setIsToggled={setIsToggled}
            setDeleteModalIsOpen={setDeleteModalIsOpen}
            handleSwitch={handleSwitch}
          />
        </div>
      </div>
      <AnimatePresence>
        {deleteModalIsOpen && (
          <DeleteConfirmModal
            setModalIsOpen={setDeleteModalIsOpen}
            activity={activity}
            handleSwitch={handleSwitch}
          />
        )}
      </AnimatePresence>
    </>
  );
}
