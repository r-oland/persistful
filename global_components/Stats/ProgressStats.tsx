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
import { endOfDay, format, startOfDay } from 'date-fns';
import Modal from 'global_components/Modal/Modal';
import Calendar from 'global_components/Calendar/Calendar';
import { AnimatePresence } from 'framer-motion';
import useGetProgressStats from 'components/progress/MobileStats/useGetProgressStats';
import styles from './Stats.module.scss';
// =========================

function DatePickerModal({
  fromOrTo,
  setFromOrTo,
}: {
  fromOrTo: 'from' | 'to';
  setFromOrTo: React.Dispatch<React.SetStateAction<'from' | 'to' | undefined>>;
}) {
  const { range, setRange } = useContext(ProgressContext);

  return (
    <Modal
      setModalIsOpen={() => setFromOrTo(undefined)}
      color="green"
      wrap
      sizeSensitiveContent
    >
      <div className={styles.modal}>
        <Calendar
          fromDate={fromOrTo === 'to' ? range.from : undefined}
          toDate={fromOrTo === 'from' ? range.to : undefined}
          activeDay={range[fromOrTo]}
          setActiveDay={(date) =>
            setRange((prev) => {
              // Close modal
              setFromOrTo(undefined);

              // Change data
              return {
                ...prev,
                [fromOrTo]:
                  fromOrTo === 'from'
                    ? startOfDay(date as Date)
                    : endOfDay(date as Date),
              };
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
  const [fromOrTo, setFromOrTo] = useState<undefined | 'from' | 'to'>(
    undefined
  );

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
          onClick: () => setFromOrTo('from'),
        },
        {
          name: 'End date',
          icon: faFlagCheckered,
          data: format(displayData.endDate, responsiveDateFormat),
          onClick: () => setFromOrTo('to'),
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
        {!!fromOrTo && (
          <DatePickerModal fromOrTo={fromOrTo} setFromOrTo={setFromOrTo} />
        )}
      </AnimatePresence>
    </>
  );
}
