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
}: {
  days?: DayEntity[];
  sum?: boolean;
}) {
  const { isLoading } = useContext(DesktopOverviewContext);
  const [isOpenState, setIsOpenState] = useState();

  const isOpen = sum ? true : isOpenState;

  return (
    <div className={styles.wrapper}>
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
