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
import React, { useContext, useState } from 'react';
import { ProgressContext } from 'pages/progress';
import { useMediaQ } from 'hooks/useMediaQ';
import { format } from 'date-fns';
import Modal from 'global_components/Modal/Modal';
import Calendar from 'global_components/Calendar/Calendar';
import { AnimatePresence } from 'framer-motion';
import useGetProgressStats from 'components/progress/MobileStats/useGetProgressStats';
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
  // @ts-ignore
  const mobileQuery = useMediaQ('max', 400);
  const desktopQuery = useMediaQ('min', 1024);
  const largeDesktopQuery = useMediaQ('min', 1500);

  const responsiveDateFormat = mobileQuery ? 'dd/MM/yy' : 'dd MMM yyyy';

  const displayData = useGetProgressStats();
  const [startEndIndex, setStartEndIndex] = useState(-1);

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
