// Components==============
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React from 'react';
import { getActiveRoute } from 'utils/getActiveRoute';
import { navItems } from 'utils/navItems';
import { ConditionaClick } from '../ConditionalClick';
import styles from './MobileNav.module.scss';
// =========================

export default function MobileNav() {
  const router = useRouter();

  const pwaInstalled =
    typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches;

  return (
    <div className={`${styles.wrapper} ${pwaInstalled ? styles.pwa : ''}`}>
      {navItems
        .filter((item) => !item.desktopOnly)
        .map((item) => (
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
  );
}
