// Components==============
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { Fragment } from 'react';
import styles from './Overlay.module.scss';
// =========================

export default function TimePicker({
  values,
  setState,
}: {
  values: string[];
  setState: React.Dispatch<React.SetStateAction<number>>;
}) {
  const controls = useAnimation();
  const valuesCount = 30;
  const amountOfValues = Array.from(Array(valuesCount).keys());
  const startPos = values.length * -20 * (valuesCount / 2);

  const y = useMotionValue(startPos);

  return (
    <motion.div
      className={styles['time-picker']}
      drag="y"
      animate={controls}
      style={{ y }}
      onDragEnd={(c, i) => {
        const getNearestValue = () => {
          // Get nearest integer
          const nearestVal = Math.round(y.get() / 20) * 20;

          // calculate index of parent (Fragment)
          const parentIndex =
            Math.floor(Math.abs(nearestVal / 20 / values.length)) *
            values.length;

          // get index of item
          const index = Math.abs(nearestVal) / 20 - parentIndex;

          // get & set value
          const value = parseInt(values[index]);
          setState(value);

          return nearestVal;
        };

        // set position based on velocity
        const delay =
          (i.velocity.y < 0 ? Math.abs(i.velocity.y) : i.velocity.y) * 3;

        setTimeout(() => controls.start({ y: getNearestValue() }), delay);
      }}
    >
      {amountOfValues.map((index) => (
        <Fragment key={index}>
          {values.map((val) => (
            <p key={val}>{val}</p>
          ))}
        </Fragment>
      ))}
    </motion.div>
  );
}
