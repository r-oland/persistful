// Components==============
import SideBarWrapper from 'global_components/LayoutWrappers/SideBarWrapper/SideBarWrapper';
import React from 'react';
import styles from './SideBar.module.scss';
// =========================

export default function SideBar() {
  return (
    <SideBarWrapper>
      <div className={styles.wrapper}>content</div>
    </SideBarWrapper>
  );
}
