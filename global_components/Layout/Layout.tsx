// Components==============
import { AnimatePresence } from 'framer-motion';
import { useMediaQ } from 'hooks/useMediaQ';
import React from 'react';
import MobileNav from './MobileNav/MobileNav';
import styles from './Layout.module.scss';
import DesktopNav from './DesktopNav/DesktopNav';
// =========================

function Component({ children }: { children: JSX.Element }) {
  const query = useMediaQ('min', 768);

  return (
    <div className={styles.wrapper}>
      <AnimatePresence>{query && <DesktopNav />}</AnimatePresence>
      <div className={styles.content}>{children}</div>
      {!query && <MobileNav />}
    </div>
  );
}

export default function Layout({
  children,
  noLayout,
}: {
  children: JSX.Element;
  noLayout?: boolean;
}) {
  if (noLayout) return children;

  return <Component>{children}</Component>;
}
