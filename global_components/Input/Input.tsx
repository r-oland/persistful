// Components==============
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { useRef, useState } from 'react';
import styles from './Input.module.scss';
// =========================

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  color = 'green',
  required = true,
  onClickOutside,
  readOnly,
}: {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  color?: 'red' | 'green';
  required?: boolean;
  onClickOutside?: (e: any) => void;
  readOnly?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside({
    refs: [ref],
    handler: (e) => {
      setIsEditing(false);
      if (onClickOutside) onClickOutside(e);
    },
    condition: !!onClickOutside && isEditing,
  });

  return (
    <div className={`${styles.wrapper} ${styles[color]}`} ref={ref}>
      <input
        type={type}
        value={value}
        onChange={(e) => {
          setIsEditing(true);
          onChange(e);
        }}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
      />
      <div className={styles.bar} />
    </div>
  );
}
