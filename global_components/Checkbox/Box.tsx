// Components==============
import { faDice } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './Checkbox.module.scss';
// =========================

export default function Box({
  penalty,
  children,
}: {
  penalty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.checkbox} ${penalty ? styles.penalty : ''}`}>
        <FontAwesomeIcon icon={faDice} size="sm" />
      </div>
      {children}
    </div>
  );
}
