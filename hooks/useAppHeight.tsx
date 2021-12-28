// Components==============
import { useEffect } from 'react';
// =========================

export function useAppHeight() {
  useEffect(() => {
    const appHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty(
        '--app-height',
        `${
          typeof visualViewport !== 'undefined'
            ? visualViewport.height
            : window.innerHeight
        }px`
      );
    };
    window.addEventListener('resize', appHeight);
    appHeight();
  }, []);
}
