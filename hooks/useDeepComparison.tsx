import { useRef } from 'react';
import isEqual from 'lodash/isEqual';

export function useDeepComparison<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);

  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}
