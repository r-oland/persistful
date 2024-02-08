// Components==============
import { faCalendarDay } from '@fortawesome/pro-regular-svg-icons';
import { faGift } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import TopNavWrapper from 'global_components/TopNavWrapper/TopNavWrapper';
import React, { useContext, useState } from 'react';
import { DesktopOverviewContext } from '../DesktopOverview';
import Items from './Items/Items';
import styles from './TopNav.module.scss';
// =========================

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);

  const { activeDay, rewards } = useContext(DesktopOverviewContext);

  return (
    <>
      <TopNavWrapper>
        <div
          className={styles.wrapper}
          onClick={() => setIsOpen(true)}
          style={{
            cursor: !isOpen ? 'pointer' : 'default',
          }}
        >
          <div className={styles.date}>
            <FontAwesomeIcon icon={faCalendarDay} />
            <p>{format(activeDay, 'MMMM yyyy')}</p>
          </div>
          <div className={styles.reward}>
            <FontAwesomeIcon icon={faGift} />
            <div className={`${styles.counter}`}>
              <p>{rewards.length || 0}</p>
            </div>
          </div>
          <AnimatePresence>
            {isOpen && <Items setIsOpen={setIsOpen} />}
          </AnimatePresence>
        </div>
      </TopNavWrapper>
    </>
  );
}
