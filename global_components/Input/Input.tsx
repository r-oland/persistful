// Components==============
import React from 'react';
import styles from './Input.module.scss';
// =========================

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  color = 'green',
}: {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  color?: 'red' | 'green';
}) {
  return (
    <div className={`${styles.wrapper} ${styles[color]}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      <div className={styles.bar} />
    </div>
  );
}
