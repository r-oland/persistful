// Components==============
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React from 'react';
import { getActiveRoute } from 'utils/getActiveRoute';
import { navItems } from 'utils/navItems';
import { ConditionaClick } from '../ConditionalClick';
import styles from './DesktopNav.module.scss';
// =========================

export default function DesktopNav() {
  const router = useRouter();

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ x: -90 }}
      animate={{ x: 0 }}
      transition={{ damping: 4 }}
    >
      {navItems.map((item) => (
        <ConditionaClick key={item.name} item={item}>
          <div
            className={`${styles.item} ${
              getActiveRoute(router.asPath, item?.link) ? styles.active : ''
            }`}
          >
            <FontAwesomeIcon icon={item.icon} />
            <p>{item.name}</p>
          </div>
        </ConditionaClick>
      ))}
    </motion.div>
  );
}
