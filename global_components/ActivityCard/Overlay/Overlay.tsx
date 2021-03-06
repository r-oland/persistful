// Components==============
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faMinus, faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useMediaQ } from 'hooks/useMediaQ';
import React, { useState } from 'react';
import { convertMinutesToHours } from 'utils/convertMinutesToHours';
import { getActivityCount } from 'utils/getActivityCount';
import ActivityProgress from '../ActivityProgress/ActivityProgress';
import styles from './Overlay.module.scss';
import TimePicker from './TimePicker';
// =========================

const content = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.25 } },
};

export default function Overlay({
  handleAdd,
  activity,
  percentage,
  day,
}: {
  handleAdd: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: number
  ) => void;
  activity: ActivityEntity;
  percentage?: number;
  day?: DayEntity;
}) {
  const [negativeDirection, setNegativeDirection] = useState(false);
  const [hourState, setHourState] = useState(0);
  const [minuteState, setMinuteState] = useState(0);
  const [timesState, setTimesState] = useState(1);

  const query = useMediaQ('min', 525);

  const total = minuteState + hourState * 60;
  const time = negativeDirection ? -total : total;
  const times = negativeDirection ? -timesState : timesState;

  // Get hours and minutes separately
  const hoursAndMinutes = convertMinutesToHours(activity.count)
    .split(':')
    .map((string) => parseInt(string));

  const hoursArrayLength =
    negativeDirection && activity.countMode === 'minutes'
      ? hoursAndMinutes[0] + 1
      : 24;
  const hours = Array.from(Array(hoursArrayLength).keys()).map((i) =>
    i < 10 ? `0${i}` : `${i}`
  );

  const noMinuteLimit = hoursAndMinutes[0] - hourState > 0;

  const minutesArrayLength =
    negativeDirection && activity.countMode === 'minutes'
      ? noMinuteLimit
        ? 12
        : hoursAndMinutes[1] / 5 + 1
      : 12;
  const minutes = Array.from(Array(minutesArrayLength).keys()).map((key) => {
    const i = key * 5;
    return i < 10 ? `0${i}` : `${i}`;
  });

  const timesArrayLength =
    negativeDirection && activity.countMode === 'times' ? activity.count : 99;
  const timesValues = Array.from(Array(timesArrayLength).keys()).map((key) => {
    const i = key + 1;
    return i < 10 ? `0${i}` : `${i}`;
  });

  const wrapperVariants = {
    initial: query ? { x: '100%' } : { y: 14 },
    animate: query ? { x: 14 } : { y: '100%' },
  };

  if (!day) return null;

  return (
    <motion.div
      className={`${styles.wrapper} ${activity.penalty ? styles.penalty : ''}`}
      initial="initial"
      animate="animate"
      exit="initial"
      variants={wrapperVariants}
      transition={{ damping: 3 }}
    >
      <motion.div variants={content} className={styles.content}>
        {query && (
          <div className={styles['outer-icon-wrapper']}>
            <div className={styles['icon-wrapper']}>
              {percentage !== undefined && (
                <ActivityProgress
                  percentage={percentage}
                  penalty={activity.penalty}
                />
              )}
              <div className={styles.icon}>
                <FontAwesomeIcon icon={activity.icon as IconName} />
              </div>
            </div>
            <p>{getActivityCount(activity)}</p>
          </div>
        )}
        <div className={styles.time}>
          {activity.countMode === 'minutes' ? (
            <>
              <TimePicker
                values={hours}
                setState={setHourState}
                resetEffect={[negativeDirection]}
              />
              <p className={styles.dots}>:</p>
              <TimePicker
                values={minutes}
                setState={setMinuteState}
                resetEffect={[negativeDirection, minutes.length]}
              />
            </>
          ) : (
            <TimePicker
              values={timesValues}
              setState={setTimesState}
              times
              resetEffect={[negativeDirection]}
            />
          )}
          <div className={styles['fade-top']} />
          <div className={styles['fade-bottom']} />
        </div>
        <div className={styles.buttons}>
          <div
            className={styles.direction}
            onClick={() => setNegativeDirection((prev) => !prev)}
            style={{
              opacity: !negativeDirection && activity.count === 0 ? 0.5 : 1,
              pointerEvents:
                !negativeDirection && activity.count === 0 ? 'none' : 'initial',
            }}
          >
            <FontAwesomeIcon icon={negativeDirection ? faMinus : faPlus} />
          </div>
          <div
            className={styles.add}
            onClick={(e) =>
              handleAdd(e, activity.countMode === 'times' ? times : time)
            }
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
