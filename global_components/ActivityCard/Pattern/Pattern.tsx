// Components==============
import React from 'react';
import styles from './Pattern.module.scss';
// =========================

export default function Pattern({
  isPenalty,
  pattern,
}: {
  isPenalty: boolean;
  pattern: PatternEntity[];
}) {
  return (
    <>
      {pattern.map((p, i) => (
        <div
          key={i}
          style={{
            width: p.size,
            height: p.size,
            transform: `rotate(${p.r}deg)`,
            top: p.top,
            right: p.right,
            bottom: p.bottom,
            left: p.left,
            clipPath:
              p.shape === 'circle'
                ? 'circle(50% at 50% 50%)'
                : 'polygon(50% 25%, 0% 100%, 100% 100%)',
          }}
          className={`${styles.pattern} ${isPenalty ? styles.penalty : ''}`}
        />
      ))}
    </>
  );
}
