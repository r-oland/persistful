// Components==============
import Button from 'global_components/Button/Button';
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import Shape from 'global_components/Shape/Shape';
import React from 'react';
import styles from './NewRewardCard.module.scss';
import { shapes } from './shapes';
// =========================

export default function NewRewardCard() {
  return (
    <ElementContainer color="black">
      <div className={styles.wrapper}>
        <p className={styles.title}>No streak reward set</p>
        <p className={styles.description}>
          Because you earn it. Well... not yet, but you will!
        </p>
        <Button color="white">Set new streak</Button>
        {shapes.map((shape, i) => (
          <Shape info={shape} color="grey" key={i} />
        ))}
      </div>
    </ElementContainer>
  );
}
