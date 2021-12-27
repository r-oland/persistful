// Components==============
import { motion } from 'framer-motion';
import React from 'react';
import styles from './HardShadow.module.scss';
// =========================

const variants = {
  hover: { scale: 1 },
  initial: { scale: 1 },
  tap: { scale: 0.9 },
};

const child = {
  hover: { x: 0, y: 0 },
  initial: { x: 4, y: -4 },
};

export default function HardShadow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={styles.wrapper}
      whileHover="hover"
      initial="initial"
      whileTap="tap"
      variants={variants}
    >
      <motion.div
        variants={child}
        className={styles.content}
        transition={{ type: 'tween', duration: 0.2 }}
      >
        {children}
      </motion.div>
      <div className={styles.shadow} />
    </motion.div>
  );
}
