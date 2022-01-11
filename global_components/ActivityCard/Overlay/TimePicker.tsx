// Components==============
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import React, { Fragment, useEffect } from 'react';
import styles from './Overlay.module.scss';
// =========================

export default function TimePicker({
  values,
  setState,
  times,
  resetEffect,
}: {
  values: string[];
  setState: React.Dispatch<React.SetStateAction<number>>;
  times?: boolean;
  resetEffect: boolean;
}) {
  const controls = useAnimation();
  const valuesCount = 30;
  const amountOfValues = times ? [0] : Array.from(Array(valuesCount).keys());
  const startPos = times ? 0 : values.length * -20 * (valuesCount / 2);

  const y = useMotionValue(startPos);

  useEffect(() => {
    controls.start({ y: startPos });
  }, [resetEffect]);

  return (
    <motion.div
      className={styles['time-picker']}
      drag="y"
      animate={controls}
      style={{ y }}
      dragConstraints={
        times ? { bottom: 0, top: (values.length - 1) * -20 } : undefined
      }
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

        // get delay based on velocity
        const delay = () => {
          // get velocity as a positive value;
          let velocity =
            i.velocity.y < 0 ? Math.abs(i.velocity.y) : i.velocity.y;

          // if velocity is to heigh, cut it off otherwise state might not be set in time
          if (velocity > 400) velocity = 400;

          // multiply to make sure you can let it scroll for longer
          return velocity * 2.5;
        };

        setTimeout(() => controls.start({ y: getNearestValue() }), delay());
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
