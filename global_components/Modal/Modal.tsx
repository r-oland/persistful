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
  wrap,
  sizeSensitiveContent,
}: {
  children: React.ReactNode;
  color: 'green' | 'red';
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  wrap?: boolean;
  sizeSensitiveContent?: boolean;
}) {
  return (
    <motion.div className={styles.wrapper} {...framerFade}>
      <div
        className={`${styles.content} ${wrap ? styles.wrap : ''} ${sizeSensitiveContent ? styles['size-sensitive-content'] : ''}`}
      >
        <ElementContainer
          color={color}
          padding={sizeSensitiveContent ? '1rem' : undefined}
        >
          {children}
        </ElementContainer>
      </div>
      <div
        className={`${styles.shader} ${styles[color]}`}
        onClick={() => setModalIsOpen(false)}
      />
    </motion.div>
  );
}
