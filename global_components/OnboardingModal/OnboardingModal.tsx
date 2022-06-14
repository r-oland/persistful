// Components==============
import { faArrowLeft, faArrowRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUpdateUser from 'actions/user/useUpdateUser';
import Button from 'global_components/Button/Button';
import Modal from 'global_components/Modal/Modal';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { content } from './content';
import styles from './OnboardingModal.module.scss';
// =========================

export default function OnboardingModal({
  setModalIsOpen,
}: {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [current, setCurrent] = useState(0);

  const { push } = useRouter();
  const { mutate } = useUpdateUser();

  const nextIsLast = current === content.length - 1;

  // set onboarding status to finished if component unmounts
  useEffect(() => () => mutate({ finishedOnboarding: true }), []);

  return (
    <Modal
      color={current === 1 ? 'red' : 'green'}
      setModalIsOpen={setModalIsOpen}
    >
      <div className={styles.wrapper}>
        <div>
          <h2>{content[current].title}</h2>
          <div className={styles.body}>
            <div className={styles.text}>{content[current].text}</div>
            <Image src={content[current].image} width={215} height={150} />
          </div>
        </div>
        <div className={styles['button-wrapper']}>
          <Button
            color="white"
            onClick={() => setCurrent((prev) => prev - 1)}
            inactive={current === 0}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </Button>
          <Button
            color={nextIsLast ? 'green' : 'white'}
            onClick={() =>
              nextIsLast ? push('/activities') : setCurrent((prev) => prev + 1)
            }
          >
            {nextIsLast ? 'Set activities' : 'Next'}
            {!nextIsLast && <FontAwesomeIcon icon={faArrowRight} />}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
