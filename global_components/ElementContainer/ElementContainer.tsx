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
  padding,
}: {
  children: React.ReactNode;
  color: Color;
  padding?: number | string;
}) {
  return (
    <HardShadow stretch>
      <div className={`${styles.wrapper} ${styles[color]}`}>
        <div className={styles.bar} />
        <div
          className={styles.content}
          style={padding ? { padding } : undefined}
        >
          {children}
        </div>
      </div>
    </HardShadow>
  );
}
