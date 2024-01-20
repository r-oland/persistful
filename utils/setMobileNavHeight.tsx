export const setMobileNavHeight = () => {
  if (typeof document === 'undefined') return;

  const pwaInstalled =
    typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches;

  const height = pwaInstalled ? '75px' : '65px';

  const doc = document.documentElement;
  doc.style.setProperty('--mobile-nav-height', height);
};
