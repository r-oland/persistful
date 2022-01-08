// Components==============
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { framerFade } from 'utils/framerAnimations';
import styles from './Checkbox.module.scss';
// =========================

export default function Checkbox({
  penalty,
  children,
  onClick,
  initialValue,
}: {
  penalty?: boolean;
  children: React.ReactNode;
  onClick: (isChecked: boolean) => void;
  initialValue: boolean;
}) {
  const [isChecked, setIsChecked] = useState(initialValue);

  return (
    <div
      className={styles.wrapper}
      onClick={() => {
        setIsChecked((prev) => !prev);
        onClick(!isChecked);
      }}
    >
      <div className={`${styles.checkbox} ${penalty ? styles.penalty : ''}`}>
        <AnimatePresence>
          {isChecked && (
            <motion.div {...framerFade}>
              <FontAwesomeIcon icon={faCheck} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {children}
    </div>
  );
}
