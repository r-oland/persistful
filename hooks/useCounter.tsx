import { useInterval } from 'hooks/useInterval';
import { useEffect, useState } from 'react';

export const useCounter = (valueTo: number) => {
  const [count, setCount] = useState(valueTo || 0);

  // prevent counter from starting on mount
  useEffect(() => {
    if (valueTo) setCount(valueTo);
  }, []);

  // Be careful chaning this, right now 1 works because count > valueTo will never be true unless you
  // reverse direction. If you change it this won't be the case any more.
  const increasePerInterval = 1;

  // Delay time per interval, setting this to null wil stop the loop
  const delay = 15;

  useInterval(
    () => {
      if (count < valueTo) {
        return setCount(count + increasePerInterval);
      }

      if (count > valueTo) {
        return setCount(count - increasePerInterval);
      }

      return setCount(valueTo);
    },
    // prevent interval from running if goal is achieved
    count === valueTo ? null : delay
  );

  return count;
};
