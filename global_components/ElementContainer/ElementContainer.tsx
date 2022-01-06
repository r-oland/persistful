// Components==============
import HardShadow from 'global_components/HardShadow/HardShadow';
import React from 'react';
import styles from './ElementContainer.module.scss';
// =========================

type Color =
  | 'green'
  | 'red'
  | 'black'
  | 'green-with-background'
  | 'red-with-background';

export default function ElementContainer({
  children,
  color,
}: {
  children: React.ReactNode;
  color: Color;
}) {
  return (
    <HardShadow stretch>
      <div className={`${styles.wrapper} ${styles[color]}`}>
        <div className={styles.bar} />
        <div className={styles.content}>{children}</div>
      </div>
    </HardShadow>
  );
}
