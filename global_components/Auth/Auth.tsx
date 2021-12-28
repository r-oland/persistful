// Components==============
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import React from 'react';
import styles from './Auth.module.scss';
// =========================

function Component({ children }: { children: React.ReactNode }) {
  const { status } = useSession({
    required: true,
  });

  return (
    <AnimatePresence>
      {status === 'loading' ? (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          key={0}
        >
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
        </motion.div>
      ) : (
        children
      )}
    </AnimatePresence>
  );
}

export default function Auth({
  children,
  noAuth,
}: {
  children: JSX.Element;
  noAuth?: boolean;
}) {
  if (noAuth) return children;

  return <Component>{children}</Component>;
}
