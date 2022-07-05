// Components==============
import { motion } from 'framer-motion';
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        className={`${styles.circle} ${styles[color]}`}
        style={style}
      />
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.12 }}
      className={`${styles.triangle} ${styles[color]}`}
      style={style}
    />
  );
}
