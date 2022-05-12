// Components==============
import React from 'react';
import styles from './TopNavWrapper.module.scss';
// =========================

export default function TopNavWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.wrapper}>{children}</div>;
}
