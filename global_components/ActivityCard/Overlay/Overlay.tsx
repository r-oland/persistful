// Components==============
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faMinus, faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useUpdateActivityCount from 'actions/day/useUpdateActivityCount';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { getActivityCount } from 'utils/getActivityCount';
import ActivityProgress from '../ActivityProgress/ActivityProgress';
import { hours, minutes } from './hoursAndMinutes';
import styles from './Overlay.module.scss';
import TimePicker from './TimePicker';
// =========================

const wrapper = {
  initial: { x: '100%' },
  animate: { x: 14 },
};

const content = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.25 } },
};

export default function Overlay({
  show,
  hide,
  activity,
  percentage,
  day,
}: {
  show: boolean;
  hide: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  activity: ActivityEntity;
  percentage?: number;
  day?: DayEntity;
}) {
  const { mutate } = useUpdateActivityCount();
  const [negativeDirection, setNegativeDirection] = useState(false);
  const [hourState, setHourState] = useState(0);
  const [minuteState, setMinuteState] = useState(0);

  const total = minuteState + hourState * 60;
  const time = negativeDirection ? -total : total;

  if (!day) return null;

  return (
    <motion.div
      className={`${styles.wrapper} ${activity.penalty ? styles.penalty : ''}`}
      initial="initial"
      animate={show ? 'animate' : 'initial'}
      variants={wrapper}
      transition={{ damping: 3 }}
    >
      <motion.div variants={content} className={styles.content}>
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
        <div className={styles.time}>
          <TimePicker values={hours} setState={setHourState} />
          <p className={styles.dots}>:</p>
          <TimePicker values={minutes} setState={setMinuteState} />
          <div className={styles['fade-top']} />
          <div className={styles['fade-bottom']} />
        </div>
        <div className={styles.buttons}>
          <div
            className={styles.direction}
            onClick={() => setNegativeDirection((prev) => !prev)}
          >
            <FontAwesomeIcon icon={negativeDirection ? faMinus : faPlus} />
          </div>
          <div
            className={styles.add}
            onClick={(e) => {
              hide(e);

              mutate({
                id: day._id,
                activityId: activity._id,
                value: activity.countMode === 'times' ? 1 : time,
              });
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
