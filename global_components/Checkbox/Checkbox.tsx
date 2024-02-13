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
  externalOnClick,
  initialValue = false,
  externalValue,
  big,
  disabled,
}: {
  penalty?: boolean;
  children: React.ReactNode;
  onClick?: (isChecked: boolean) => void;
  externalOnClick?: () => void;
  initialValue?: boolean;
  externalValue?: boolean;
  big?: boolean;
  disabled?: boolean;
}) {
  const [isChecked, setIsChecked] = useState(initialValue);
  const condition = externalValue !== undefined ? externalValue : isChecked;

  return (
    <div
      className={`${styles.wrapper} ${big ? styles.big : ''} ${disabled ? styles.disabled : ''}`}
      onClick={() => {
        if (externalOnClick) return externalOnClick();

        if (onClick) {
          setIsChecked((prev) => !prev);
          onClick(!isChecked);
        }
      }}
    >
      <div className={`${styles.checkbox} ${penalty ? styles.penalty : ''}`}>
        <AnimatePresence>
          {condition && (
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
