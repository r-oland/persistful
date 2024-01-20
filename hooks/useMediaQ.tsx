import { useEffect, useState } from 'react';

export const useMediaQ = (
  minMax: 'min' | 'max',
  MinMaxWidth: 525 | 768 | 1024 | 1325 | 1500
): boolean => {
  const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 768;
  const [width, setWidth] = useState(innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setWidth]);

  if (minMax === 'min') return width >= MinMaxWidth;
  return width <= MinMaxWidth;
};
