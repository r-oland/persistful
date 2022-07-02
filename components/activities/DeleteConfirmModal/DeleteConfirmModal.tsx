// Components==============
import { faTimes, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUpdateActivity from 'actions/activity/useUpdateActivity';
import Button from 'global_components/Button/Button';
import Modal from 'global_components/Modal/Modal';
import React from 'react';
import styles from './DeleteConfirmModal.module.scss';
// =========================

export default function DeleteConfirmModal({
  setModalIsOpen,
  activity,
  handleSwitch,
}: {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activity?: ActivityEntity;
  handleSwitch: (id: string) => void;
}) {
  const updateActivity = useUpdateActivity();

  const handleDeleteActivity = () => {
    if (!activity?._id) return;

    updateActivity
      .mutateAsync({
        id: activity._id,
        status: 'deleted',
      })
      .then(() => handleSwitch('new-activity'));
  };
  return (
    <Modal setModalIsOpen={setModalIsOpen} color="red">
      <div className={styles.wrapper}>
        <div>
          <h2>Are you sure that you want to delete this activity?</h2>
          <p>
            This action is not permanent. You can always pick up where you left
            off by adding a new activity with the name{' '}
            <strong>{activity?.name}</strong>.
          </p>
        </div>
        <div className={styles['button-wrapper']}>
          <Button color="white" onClick={() => setModalIsOpen(false)}>
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </Button>
          <Button color="red" onClick={handleDeleteActivity}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
