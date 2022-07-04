// Components==============
import {
  faArrowUpFromSquare,
  faPlusSquare,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'global_components/Modal/Modal';
import { PwaInstallContext } from 'hooks/usePwaInstall';
import React, { useContext } from 'react';
import styles from './IosInstallPrompt.module.scss';
// =========================

export default function IosInstallPrompt() {
  const { setIosInstallModalIsOpen } = useContext(PwaInstallContext);

  return (
    <Modal setModalIsOpen={setIosInstallModalIsOpen} color="green">
      <div className={styles.wrapper}>
        <h3>Install on your device</h3>
        <p>
          Quicker access, more screen real estate and more? Use Persistful the
          way it was intended.
        </p>
        <p>
          Install the app on your device by clicking on the{' '}
          <strong>share icon</strong>{' '}
          <FontAwesomeIcon icon={faArrowUpFromSquare} /> and selecting the
          option: <strong>Add to Home Screen</strong>{' '}
          <FontAwesomeIcon icon={faPlusSquare} />
        </p>
      </div>
    </Modal>
  );
}
