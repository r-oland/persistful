// Components==============
import React from 'react';
import styles from './Shape.module.scss';
// =========================

export default function Shape({
  info,
  color,
}: {
  info: PatternEntity;
  color: 'red' | 'green' | 'grey';
}) {
  const { size, top, right, bottom, left, r, shape } = info;

  const style = {
    width: size,
    height: size,
    top,
    right,
    bottom,
    left,
    transform: `rotate(${r}deg)`,
  };

  if (shape === 'circle')
    return (
      <div className={`${styles.circle} ${styles[color]}`} style={style} />
    );

  return (
    <div className={`${styles.triangle} ${styles[color]}`} style={style} />
  );
}
