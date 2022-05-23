import { useInterval } from 'hooks/useInterval';
import { useEffect, useState } from 'react';

export const useCounter = (valueTo: number) => {
  const [count, setCount] = useState(valueTo || 0);

  // prevent counter from starting on mount
  useEffect(() => {
    if (valueTo) setCount(valueTo);
  }, []);

  const defaultIncrease = 3;

  let increasePerInterval = defaultIncrease;

  // Delay time per interval, setting this to null wil stop the loop
  const delay = 15;

  useInterval(
    () => {
      if (count < valueTo) {
        // prevent counter from going on for infinity
        if (valueTo - count < defaultIncrease) increasePerInterval = 1;
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
