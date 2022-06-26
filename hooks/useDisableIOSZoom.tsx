// Components==============
import { useEffect } from 'react';
// =========================

export function useDisableIOSZoom() {
  useEffect(() => {
    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });

    document.addEventListener('gesturechange', (e) => {
      e.preventDefault();
    });

    document.addEventListener('gestureend', (e) => {
      e.preventDefault();
    });
  }, []);
}
