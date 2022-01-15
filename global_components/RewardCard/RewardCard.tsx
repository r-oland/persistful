// Components==============
import { AnimatePresence } from 'framer-motion';
import Button from 'global_components/Button/Button';
import HardShadow from 'global_components/HardShadow/HardShadow';
import RewardModal from 'global_components/RewardModal/RewardModal';
import Shape from 'global_components/Shape/Shape';
import SmallProgressCircle from 'global_components/SmallProgressCircle/SmallProgressCircle';
import Image from 'next/image';
import React, { useState } from 'react';
import styles from './RewardCard.module.scss';
import { shapes } from './shapes';
// =========================

export default function RewardCard({ reward }: { reward: RewardEntity }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <HardShadow stretch>
        <div className={styles.wrapper}>
          <div className={styles.image}>
            <Image src={reward.image} layout="fill" />
          </div>
          <div className={styles.content}>
            <div className={styles.bottom}>
              <div className={styles.top}>
                <div>
                  <p className={styles.title}>{reward.name}</p>
                </div>
                <Button color="white" onClick={() => setModalIsOpen(true)}>
                  View
                </Button>
              </div>
              <SmallProgressCircle
                percentage={(100 / reward.totalCycles) * reward.completedCycles}
                color="black"
                large
              >
                <div className={styles['count-wrapper']}>
                  <svg
                    width="29"
                    height="39"
                    viewBox="0 0 29 39"
                    className={styles.flame}
                  >
                    <path
                      d="M14.5 18.3529C19.3333 11.5624 14.5 2.29412 12.0833 0C12.0833 6.96953 7.79858 10.8764 4.83333 13.7647C1.8705 16.6553 0 21.1976 0 25.2353C0 28.8859 1.52767 32.387 4.24695 34.9684C6.96623 37.5498 10.6544 39 14.5 39C18.3456 39 22.0338 37.5498 24.7531 34.9684C27.4723 32.387 29 28.8859 29 25.2353C29 21.7207 26.448 16.1965 24.1667 13.7647C19.8505 20.6471 17.4218 20.6471 14.5 18.3529Z"
                      fill="#282F36"
                    />
                  </svg>
                  <p className={styles.count}>
                    {reward.totalCycles - reward.completedCycles}
                  </p>
                </div>
                <p className={styles['cycles-left']}>Cycles left</p>
              </SmallProgressCircle>
            </div>
            {shapes.map((shape, i) => (
              <Shape info={shape} color="grey" key={i} />
            ))}
          </div>
        </div>
      </HardShadow>
      <AnimatePresence>
        {modalIsOpen && (
          <RewardModal setModalIsOpen={setModalIsOpen} reward={reward} />
        )}
      </AnimatePresence>
    </>
  );
}
