// Components==============
import React from 'react';
import styles from './Input.module.scss';
// =========================

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <div className={styles.wrapper}>
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
