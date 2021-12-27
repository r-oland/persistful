// Components==============
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons';
import { motion } from 'framer-motion';
import styles from './Auth.module.scss';
// =========================

export default function Auth({ children }: { children: JSX.Element }) {
  const { status } = useSession({
    required: true,
  });

  if (status === 'loading')
    return (
      <div className={styles.wrapper}>
        <motion.div
          animate={{
            rotate: [0, 720],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <FontAwesomeIcon icon={faSpinnerThird} />
        </motion.div>
      </div>
    );

  return children;
}
