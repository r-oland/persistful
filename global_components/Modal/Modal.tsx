// Components==============
import { AnimatePresence, motion } from 'framer-motion';
import ElementContainer from 'global_components/ElementContainer/ElementContainer';
import React from 'react';
import { framerFade } from 'utils/framerAnimations';
import styles from './Modal.module.scss';
// =========================

type Props = {
  children: React.ReactNode;
  color: 'green' | 'red';
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Content({ children, color, setModalIsOpen }: Props) {
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

export default function Modal(props: Props) {
  const { children, modalIsOpen } = props;

  return (
    <AnimatePresence>
      {modalIsOpen && <Content {...props}>{children}</Content>}
    </AnimatePresence>
  );
}
