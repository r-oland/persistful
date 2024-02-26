// Components==============
import {
  faCheck,
  faClock,
  faFlagCheckered,
  faFlame,
  faGauge,
  faLocationDot,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDeepComparison } from 'hooks/useDeepComparison';
import React, { useContext, useEffect, useState } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getDayAchievements } from 'utils/getDayAchievements';
import { ProgressContext } from 'pages/progress';
import useGetDays from 'actions/day/useGetDays';
import { useMediaQ } from 'hooks/useMediaQ';
import { format } from 'date-fns';
import Modal from 'global_components/Modal/Modal';
import Calendar from 'global_components/Calendar/Calendar';
import { AnimatePresence } from 'framer-motion';
import styles from './Stats.module.scss';
// =========================

function DatePickerModal({
  StartEndIndex,
  setStartEndIndex,
}: {
  StartEndIndex: number;
  setStartEndIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { range, setRange } = useContext(ProgressContext);

  return (
    <Modal
      setModalIsOpen={() => setStartEndIndex(-1)}
      color="green"
      wrap
      sizeSensitiveContent
    >
      <div className={styles.modal}>
        <Calendar
          fromDate={StartEndIndex === 1 ? range[0] : undefined}
          toDate={StartEndIndex === 0 ? range[1] : undefined}
          activeDay={range[StartEndIndex]}
          setActiveDay={(date) =>
            // @ts-ignore
            setRange((prev) => {
              // Close modal
              setStartEndIndex(-1);

              // Change data
              return prev.map((d, i) => (i === StartEndIndex ? date : d));
            })
          }
        />
      </div>
    </Modal>
  );
}

export default function ProgressStats() {
  const { isLoading, range } = useContext(ProgressContext);

  // @ts-ignore
  const mobileQuery = useMediaQ('max', 400);
  const desktopQuery = useMediaQ('min', 1024);
  const largeDesktopQuery = useMediaQ('min', 1500);

  const responsiveDateFormat = mobileQuery ? 'dd/MM/yy' : 'dd MMM yyyy';

  // retry = false because days range can be selected that doesn't exists. This prevents it from trying to query in it on fail
  const { data: days } = useGetDays(range[0], range[1]);

  const defaultState: {
    totalTime: string;
    averageTime: string;
    totalCycles: number;
    daysTracked: number;
    startDate: Date;
    endDate: Date;
  } = {
    totalTime: '0:00',
    averageTime: '0:00',
    totalCycles: 0,
    daysTracked: 0,
    startDate: new Date(),
    endDate: new Date(),
  };

  const [displayData, setDisplayData] = useState(defaultState);
  const [startEndIndex, setStartEndIndex] = useState(-1);

  // set display data in a state so it doesn't return undefined values while switching days
  useEffect(() => {
    if (!days && !isLoading) return setDisplayData(defaultState);
    if (isLoading) return;

    const totalTime =
      days
        ?.map((d) => getDayAchievements(d).total)
        .reduce((prev, cur) => prev + cur, 0) || 0;

    const averageTime = totalTime / (days?.length || 1);

    const totalCycles =
      days
        ?.map((d) => getDayAchievements(d).streak)
        .reduce((prev, cur) => prev + cur, 0) || 0;

    const daysTracked = days?.length || 0;

    const startDate = range[0];
    const endDate = range[1];

    return setDisplayData({
      totalTime: convertMinutesToHours(totalTime),
      averageTime: convertMinutesToHours(averageTime),
      totalCycles,
      daysTracked,
      startDate,
      endDate,
    });
  }, [useDeepComparison(days), isLoading]);

  const conditionalData = largeDesktopQuery
    ? [
        {
          name: 'Total cycles',
          icon: faFlame,
          data: displayData.totalCycles,
        },
        {
          name: 'Days tracked',
          icon: faCheck,
          data: displayData.daysTracked,
        },
      ]
    : [];

  const cards = desktopQuery
    ? [
        {
          name: 'Total time',
          icon: faClock,
          data: displayData.totalTime,
        },
        {
          name: 'Average time',
          icon: faGauge,
          data: displayData.averageTime,
        },
        ...conditionalData,
      ]
    : [
        {
          name: 'Start date',
          icon: faLocationDot,
          data: format(displayData.startDate, responsiveDateFormat),
          onClick: () => setStartEndIndex(0),
        },
        {
          name: 'End date',
          icon: faFlagCheckered,
          data: format(displayData.endDate, responsiveDateFormat),
          onClick: () => setStartEndIndex(1),
        },
      ];

  return (
    <>
      <div
        className={styles.wrapper}
        style={{ gridTemplateColumns: `repeat(${cards.length}, 1fr)` }}
      >
        {cards.map((card) => (
          <div
            key={card.name}
            className={`${styles.card} ${styles.green} ${(card as { onClick?: () => void })?.onClick ? styles['with-click'] : ''}`}
            onClick={(card as { onClick?: () => void })?.onClick}
          >
            <div className={styles.icon}>
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <div className={styles['text-wrapper']}>
              <p className={styles.name}>{card.name}</p>
              <p className={styles.data}>{card.data}</p>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {startEndIndex > -1 && (
          <DatePickerModal
            StartEndIndex={startEndIndex}
            setStartEndIndex={setStartEndIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}
