// Components==============
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import HardShadow from 'global_components/HardShadow/HardShadow';
import React, { useState } from 'react';
import { icons } from 'utils/fontawesomeHelper';
import { framerFade } from 'utils/framerAnimations';
import styles from './IconSelector.module.scss';
// =========================

export default function IconSelector({
  penalty,
  icon,
  setSaveObject,
}: {
  penalty: boolean;
  icon: string;
  setSaveObject: React.Dispatch<React.SetStateAction<Partial<ActivityEntity>>>;
}) {
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

  const fill = penalty ? '#FF7360' : '#18E597';

  return (
    <div className={`${styles.wrapper} ${penalty ? styles.penalty : ''}`}>
      <div
        className={styles.icon}
        onClick={() => setTooltipIsOpen((prev) => !prev)}
      >
        <FontAwesomeIcon icon={icon as IconName} />
      </div>
      <AnimatePresence>
        {tooltipIsOpen && (
          <motion.div {...framerFade}>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              className={styles['arrow-1']}
            >
              <path d="M7 0L13.9282 9.75H0.0717969L7 0Z" fill={fill} />
            </svg>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              className={styles['arrow-2']}
            >
              <path
                d="M1.04047 9.25L7 0.863201L12.9595 9.25H1.04047Z"
                fill={fill}
                stroke="#282F36"
              />
            </svg>
            <div className={styles.tooltip}>
              <HardShadow>
                <div className={styles.inside}>
                  <div className={styles.bar} />
                  <div className={styles['scroll-container']}>
                    <div className={styles.content}>
                      {icons.map((i) => (
                        <FontAwesomeIcon
                          icon={i as IconName}
                          key={i}
                          className={icon === i ? styles.active : ''}
                          onClick={() => {
                            setSaveObject((prev) => ({ ...prev, icon: i }));
                            setTooltipIsOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </HardShadow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
