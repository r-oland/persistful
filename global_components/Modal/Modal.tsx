// Components==============
import { motion } from 'framer-motion';
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import React from 'react';
import { framerFade } from 'utils/framerAnimations';
import styles from './Modal.module.scss';
// =========================

export default function Modal({
  children,
  color,
  setModalIsOpen,
}: {
  children: React.ReactNode;
  color: 'green' | 'red';
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <motion.div className={styles.wrapper} {...framerFade}>
      <div className={styles.content}>
        <ElementContainer color={color}>{children}</ElementContainer>
      </div>
      <div
        className={`${styles.shader} ${styles[color]}`}
        onClick={() => setModalIsOpen(false)}
      />
    </motion.div>
  );
}
