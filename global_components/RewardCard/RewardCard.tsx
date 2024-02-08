// Components==============
import HardShadow from 'global_components/HardShadow/HardShadow';
import Shape from 'global_components/Shape/Shape';
import SmallProgressCircle from 'global_components/SmallProgressCircle/SmallProgressCircle';
import { useMediaQ } from 'hooks/useMediaQ';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import React from 'react';
import { faRotateRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetUser from 'actions/user/useGetUser';
import styles from './RewardCard.module.scss';
import { shapes } from './shapes';
// =========================

export default function RewardCard({
  reward,
  setSelectedReward,
}: {
  reward: RewardEntity;
  setSelectedReward?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const query = useMediaQ('min', 768);
  const { push } = useRouter();

  const { data: user } = useGetUser();

  const isCompleted = reward.completedCycles === reward.totalCycles;

  const rewardStatus = !user?.activeReward
    ? 'unset'
    : isCompleted
      ? 'completed'
      : user.activeReward === reward._id
        ? 'active'
        : 'stale';

  return (
    <HardShadow stretch animations={!!setSelectedReward}>
      <div
        className={styles.wrapper}
        onClick={
          setSelectedReward
            ? () =>
                query
                  ? setSelectedReward(reward._id)
                  : push(`/reward/${reward._id}`)
            : undefined
        }
      >
        <div className={styles['relative-wrapper']}>
          <div className={styles.image}>
            <Image src={reward.image} layout="fill" alt={reward.name} />
            <div className={styles.shade} />
            <div className={styles.content}>
              <p className={styles.name}>{reward.name}</p>
              <p className={styles.mode}>
                <FontAwesomeIcon icon={faRotateRight} /> reset
              </p>
              <p className={`${styles.status} ${styles[rewardStatus]}`}>
                {rewardStatus.charAt(0).toUpperCase() + rewardStatus.slice(1)}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.bar} />
        <div className={styles.progress}>
          <SmallProgressCircle
            percentage={(100 / reward.totalCycles) * reward.completedCycles}
            color={isCompleted ? 'dark-green' : 'black'}
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
                  fill={isCompleted ? '#68b99a' : '#282F36'}
                />
              </svg>
              <p className={styles.count}>
                {reward.totalCycles - reward.completedCycles}
              </p>
            </div>
            <p className={styles['cycles-left']}>Cycles left</p>
          </SmallProgressCircle>
          {shapes.map((shape, i) => (
            <Shape
              info={shape}
              color={isCompleted ? 'green' : 'grey'}
              key={i}
            />
          ))}
        </div>
      </div>
    </HardShadow>
  );
}
