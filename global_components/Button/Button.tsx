// Components==============
import HardShadow from 'global_components/HardShadow/HardShadow';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './Button.module.scss';
// =========================

type Color = 'red' | 'green' | 'white';

export default function Button({
  children,
  onClick,
  to,
  inactive,
  color,
}: {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  to?: string;
  inactive?: boolean;
  color: Color;
}) {
  const history = useRouter();

  return (
    <HardShadow>
      <button
        onClick={
          to
            ? (e) => {
                e.stopPropagation();
                history.push(to);
              }
            : onClick
        }
        type={to ? 'button' : 'submit'}
        className={`${styles.wrapper} ${styles[color]}`}
        style={
          inactive
            ? {
                pointerEvents: 'none',
                opacity: 0.5,
              }
            : {}
        }
      >
        {children}
      </button>
    </HardShadow>
  );
}
