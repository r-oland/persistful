// Components==============
import React, { useEffect, useState } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import styles from './Slider.module.scss';
// =========================

export default function Slider({
  initialValue,
  onChange,
  penalty,
  min,
  max,
  time,
  step = 5,
  hideValue,
  onMount,
}: {
  initialValue: number;
  onChange: (value: number) => void;
  penalty?: boolean;
  min: number;
  max: number;
  time?: boolean;
  step?: number;
  hideValue?: boolean;
  onMount?: (value: number) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [sliderPosition, setSliderPosition] = useState(initialValue);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const currentPosition = parseInt(e.target.value);
    setSliderPosition(currentPosition);
    onChange(currentPosition);
    setValue(currentPosition);
  }

  const range = max - min;
  const correctedStartValue = sliderPosition - min;
  const percentage = (correctedStartValue * 100) / range;
  const offset = (sliderPosition / max - 0.5) * 10;

  useEffect(() => {
    if (onMount) onMount(value);
  }, []);

  return (
    <div
      className={`${styles.container} ${penalty ? styles.penalty : ''} ${hideValue ? styles['hide-value'] : ''}`}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderPosition}
        className={styles.slider}
        onChange={handleChange}
      />
      {!hideValue && (
        <p
          style={{
            left: `calc(${percentage}% - ${offset}px)`,
          }}
        >
          {time ? convertMinutesToHours(value) : value}
        </p>
      )}
    </div>
  );
}
