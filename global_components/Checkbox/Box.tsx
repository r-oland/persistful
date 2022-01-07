// Components==============
import { faDice } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './Checkbox.module.scss';
// =========================

export default function Box({ penalty }: { penalty?: boolean }) {
  return (
    <div className={`${styles.wrapper} ${penalty ? styles.penalty : ''}`}>
      <FontAwesomeIcon icon={faDice} size="sm" />
    </div>
  );
}
