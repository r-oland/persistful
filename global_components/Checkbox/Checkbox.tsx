// Components==============
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { framerFade } from 'utils/framerAnimations';
import styles from './Checkbox.module.scss';
// =========================

export default function Checkbox({
  isChecked,
  penalty,
}: {
  isChecked: boolean;
  penalty?: boolean;
}) {
  return (
    <div className={`${styles.wrapper} ${penalty ? styles.penalty : ''}`}>
      <AnimatePresence>
        {isChecked && (
          <motion.div {...framerFade}>
            <FontAwesomeIcon icon={faCheck} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
