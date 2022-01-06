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
  hover: {
    x: 0,
    y: 0,
    transition: {
      damping: 4,
    },
  },
  initial: { x: 4, y: -4 },
};

export default function HardShadow({
  children,
  stretch,
  clickAnimation,
}: {
  children: React.ReactNode;
  stretch?: boolean;
  clickAnimation?: boolean;
}) {
  return (
    <motion.div
      className={styles.wrapper}
      whileHover="hover"
      initial="initial"
      whileTap={clickAnimation ? 'tap' : undefined}
      variants={variants}
      style={{ width: stretch ? 'calc(100% - 4px)' : '' }}
    >
      <motion.div variants={child} className={styles.content}>
        {children}
      </motion.div>
      <div className={styles.shadow} />
    </motion.div>
  );
}
