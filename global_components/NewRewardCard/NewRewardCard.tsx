// Components==============
import { AnimatePresence } from 'framer-motion';
import Button from 'global_components/Button/Button';
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import RewardModal from 'global_components/RewardModal/RewardModal';
import Shape from 'global_components/Shape/Shape';
import React, { useState } from 'react';
import styles from './NewRewardCard.module.scss';
import { shapes } from './shapes';
// =========================

export default function NewRewardCard() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <ElementContainer color="black">
        <div className={styles.wrapper}>
          <p className={styles.title}>No streak reward set</p>
          <p className={styles.description}>
            Because you earn it. Well... not yet, but you will!
          </p>
          <Button color="white" onClick={() => setModalIsOpen(true)}>
            Set new streak
          </Button>
          {shapes.map((shape, i) => (
            <Shape info={shape} color="grey" key={i} />
          ))}
        </div>
      </ElementContainer>
      <AnimatePresence>
        {modalIsOpen && <RewardModal setModalIsOpen={setModalIsOpen} />}
      </AnimatePresence>
    </>
  );
}
