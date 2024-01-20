// Components==============
import { useEffect } from 'react';
// =========================

export const setAppHeight = () => {
  if (typeof document === 'undefined') return;

  const doc = document.documentElement;

  const supportsDvh = CSS.supports('height', '100dvh');

  const height = supportsDvh
    ? '100dvh'
    : `${
        typeof visualViewport !== 'undefined'
          ? visualViewport?.height
          : window.innerHeight
      }px`;

  doc.style.setProperty('--app-height', height);
};

setAppHeight();

export function useAppHeight() {
  useEffect(() => {
    const supportsDvh = CSS.supports('height', '100dvh');
    if (supportsDvh) return;

    window.addEventListener('resize', setAppHeight);
  }, []);
}
