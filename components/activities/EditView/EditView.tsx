// Components==============
import useGetActivities from 'actions/activity/useGetActivities';
import { AnimatePresence } from 'framer-motion';
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import { ActivitiesContext } from 'pages/activities';
import React, { useContext, useState } from 'react';
import Content from './Content';
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal';
import styles from './EditView.module.scss';
// =========================

export default function EditView() {
  const { data: activities } = useGetActivities();
  const { selectedActivity, setSelectedActivity } =
    useContext(ActivitiesContext);
  const newActivity = selectedActivity === 'new-activity';
  const activity = activities?.find((a) => selectedActivity === a._id);

  const [isToggled, setIsToggled] = useState(
    newActivity ? false : activity?.status === 'active'
  );

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const penaltyMode = newActivity ? isToggled : activity?.penalty;

  const handleSwitch = (id: string) => setSelectedActivity(id);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.element}>
          <ElementContainer color={penaltyMode ? 'red' : 'green'}>
            <Content
              isToggled={isToggled}
              setIsToggled={setIsToggled}
              setDeleteModalIsOpen={setDeleteModalIsOpen}
              activity={activity}
              handleSwitch={handleSwitch}
            />
          </ElementContainer>
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
