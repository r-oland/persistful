// Components==============
import { faDownload } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { handlePwaInstall, PwaInstallContext } from 'hooks/usePwaInstall';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { getActiveRoute } from 'utils/getActiveRoute';
import { navItems } from 'utils/navItems';
import { ConditionaClick } from '../ConditionalClick';
import styles from './DesktopNav.module.scss';
// =========================

export default function DesktopNav() {
  const router = useRouter();

  const context = useContext(PwaInstallContext);
  const { deferredPrompt, canShowIosInstall } = context;

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ x: -90 }}
      animate={{ x: 0 }}
      transition={{ damping: 4 }}
    >
      <div className={styles.items}>
        {navItems.map((item) => (
          <ConditionaClick key={item.name} item={item}>
            <div
              className={`${styles.item} ${
                getActiveRoute(router.pathname, item?.link) ? styles.active : ''
              }`}
            >
              <FontAwesomeIcon icon={item.icon} />
              <p>{item.name}</p>
            </div>
          </ConditionaClick>
        ))}
      </div>
      {!!(deferredPrompt || canShowIosInstall) && (
        <button type="button" onClick={() => handlePwaInstall(context)}>
          <div className={styles.item}>
            <FontAwesomeIcon icon={faDownload} />
            <p>Install</p>
          </div>
        </button>
      )}
    </motion.div>
  );
}
