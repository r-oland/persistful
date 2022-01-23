// Components==============
import Button from 'global_components/Button/Button';
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import Shape from 'global_components/Shape/Shape';
import { useMediaQ } from 'hooks/useMediaQ';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './NewRewardCard.module.scss';
import { shapes } from './shapes';
// =========================

export default function NewRewardCard({
  setModalIsOpen,
}: {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const query = useMediaQ('min', 768);
  const { push } = useRouter();

  return (
    <ElementContainer color="black">
      <div className={styles.wrapper}>
        <p className={styles.title}>No streak reward set</p>
        <p className={styles.description}>
          Because you earn it. Well... not yet, but you will!
        </p>
        <Button
          color="white"
          onClick={() => (query ? setModalIsOpen(true) : push(`/reward/new`))}
        >
          Set new streak
        </Button>
        {shapes.map((shape, i) => (
          <Shape info={shape} color="grey" key={i} />
        ))}
      </div>
    </ElementContainer>
  );
}
