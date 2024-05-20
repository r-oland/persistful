// Components==============
import React, { useEffect, useState } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import styles from './Slider.module.scss';
// =========================

export default function Slider({
  initialValue,
  onChange,
  penalty,
  min,
  max,
  increaseMax,
  time,
  step = 5,
  hideValue,
}: {
  initialValue: number;
  onChange: (value: number) => void;
  penalty?: boolean;
  min: number;
  max: number;
  increaseMax?: React.Dispatch<React.SetStateAction<number>>;
  time?: boolean;
  step?: number;
  hideValue?: boolean;
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

  // Resolve bug where initial max value is lower than initial value
  useEffect(() => {
    if (initialValue > max && increaseMax) increaseMax(initialValue);
  }, [initialValue]);

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
      {!!increaseMax && max === sliderPosition && (
        <div
          className={styles['increase-max']}
          // 60 because it works nice with time values
          onClick={() => increaseMax(sliderPosition + 60)}
        >
          <FontAwesomeIcon icon={faPlus} />
        </div>
      )}
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
