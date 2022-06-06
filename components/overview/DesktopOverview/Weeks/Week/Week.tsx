// Components==============
import Graph from 'global_components/Graph/Graph';
import ProgressCircle from 'global_components/ProgressCircle/ProgressCircle';
import DesktopOverviewStats from 'global_components/Stats/DesktopOverviewStats';
import React, { useContext, useState } from 'react';
import { DesktopOverviewContext } from '../../DesktopOverview';
import styles from './Week.module.scss';
// =========================

export default function Week({
  days,
  sum,
  lastItem,
}: {
  days?: DayEntity[];
  sum?: boolean;
  lastItem?: boolean;
}) {
  const { isLoading } = useContext(DesktopOverviewContext);
  const [isOpenState, setIsOpenState] = useState(false);

  const isOpen = sum ? true : isOpenState;

  return (
    <div
      className={styles.wrapper}
      onClick={() => setIsOpenState((prev) => !prev)}
      style={{
        cursor: !sum ? 'pointer' : 'default',
        marginBottom: isOpenState && !lastItem ? '2.5rem' : '',
      }}
    >
      <DesktopOverviewStats days={days} isSum={sum} />
      {isOpen && (
        <div className={styles.top}>
          <div>
            <ProgressCircle days={days} isLoading={isLoading} />
          </div>
          <Graph days={days} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
