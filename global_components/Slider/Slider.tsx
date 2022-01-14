// Components==============
import React, { useState } from 'react';
import { converMinutesToHours } from 'utils/convertMinutesToHours';
import styles from './Slider.module.scss';
// =========================

export default function Slider({
  initialValue,
  handleRelease,
  penalty,
  min,
  max,
  time,
  step = 5,
}: {
  initialValue: number;
  handleRelease: (value: number) => void;
  penalty?: boolean;
  min: number;
  max: number;
  time?: boolean;
  step?: number;
}) {
  const [value, setValue] = useState(initialValue);
  const [sliderPosition, setSliderPosition] = useState(initialValue);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const currentPosition = parseInt(e.target.value);
    setSliderPosition(currentPosition);

    setValue(currentPosition);
  }

  const range = max - min;
  const correctedStartValue = sliderPosition - min;
  const percentage = (correctedStartValue * 100) / range;
  const offset = (sliderPosition / max - 0.5) * 10;

  return (
    <div className={`${styles.container} ${penalty ? styles.penalty : ''}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderPosition}
        className={styles.slider}
        onChange={handleChange}
        onPointerUp={() => handleRelease(value)}
      />
      <p
        style={{
          left: `calc(${percentage}% - ${offset}px)`,
        }}
      >
        {time ? converMinutesToHours(value) : value}
      </p>
    </div>
  );
}
