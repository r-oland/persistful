// Components==============
import { faDice } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './Checkbox.module.scss';
// =========================

export default function Box({
  penalty,
  children,
  onClick,
}: {
  penalty?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={`${styles.checkbox} ${penalty ? styles.penalty : ''}`}>
        <FontAwesomeIcon icon={faDice} size="sm" />
      </div>
      {children}
    </div>
  );
}
