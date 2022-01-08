// Components==============
import { motion } from 'framer-motion';
import React from 'react';
import styles from './Toggle.module.scss';
// =========================

export default function Toggle({
  isToggled,
  onClick,
  penalty,
}: {
  isToggled: boolean;
  onClick: () => void;
  penalty?: boolean;
}) {
  return (
    <div
      className={`${styles.wrapper} ${penalty ? styles.penalty : ''}`}
      onClick={onClick}
    >
      <motion.div
        className={styles.circle}
        initial={isToggled ? { x: 27 } : { x: 0 }}
        animate={isToggled ? { x: 27 } : { x: 0 }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
        }}
      />
    </div>
  );
}
