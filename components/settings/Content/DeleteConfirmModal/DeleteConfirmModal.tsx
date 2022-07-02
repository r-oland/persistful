// Components==============
import { faTimes, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDeleteUser from 'actions/user/useDeleteUser';
import Button from 'global_components/Button/Button';
import Modal from 'global_components/Modal/Modal';
import React, { useEffect, useState } from 'react';
import styles from './DeleteConfirmModal.module.scss';
// =========================

export default function DeleteConfirmModal({
  setModalIsOpen,
}: {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mutate } = useDeleteUser();
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    if (counter === 0) return;

    // prevent delay from being set to 0 while animating
    const timeout = setTimeout(() => setCounter((prev) => prev - 1), 1000);
    return () => clearTimeout(timeout);
  }, [counter]);

  return (
    <Modal setModalIsOpen={setModalIsOpen} color="red">
      <div className={styles.wrapper}>
        <div>
          <h2>Careful now!</h2>
          <p>
            Once again, this action is permanently and can not be reversed. Are
            you sure that you want to delete all of your tracked progress?
          </p>
        </div>
        <div className={styles['button-wrapper']}>
          <Button color="white" onClick={() => setModalIsOpen(false)}>
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </Button>
          <Button color="red" onClick={() => mutate()} inactive={!!counter}>
            <FontAwesomeIcon icon={faTrash} /> Delete {!!counter && counter}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
