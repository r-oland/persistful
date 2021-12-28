// Components==============
import React from 'react';
import styles from './SideBarWrapper.module.scss';
// =========================

export default function SideBarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.wrapper}>{children}</div>;
}
