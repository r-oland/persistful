// Components==============
import HardShadow from 'global_components/HardShadow/HardShadow';
import Shape from 'global_components/Shape/Shape';
import SmallProgressCircle from 'global_components/SmallProgressCircle/SmallProgressCircle';
import { useMediaQ } from 'hooks/useMediaQ';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  faCheck,
  faFire,
  faPartyHorn,
  faRotateRight,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useGetUser from 'actions/user/useGetUser';
import useCompleteReward from 'actions/reward/useCompleteReward';
import { format } from 'date-fns';
import styles from './RewardCard.module.scss';
import { generateRewardShapes } from './generateRewardShapes';
// =========================

export default function RewardCard({
  reward,
  setSelectedReward,
}: {
  reward: RewardEntity;
  setSelectedReward?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [rewardShapes] = useState(generateRewardShapes());

  const progressPage = !setSelectedReward;

  const query = useMediaQ('min', 768);
  const { push } = useRouter();

  const { data: user } = useGetUser();
  const { mutate: completeReward } = useCompleteReward();

  const isCompleted = reward.completedCycles === reward.totalCycles;

  const rewardStatus = isCompleted
    ? 'completed'
    : !user?.activeReward
      ? 'unset'
      : user.activeReward === reward._id
        ? 'active'
        : 'stale';

  const rewardContent = isCompleted
    ? {
        text: progressPage
          ? format(reward.endDate as Date, 'dd MMM yyyy')
          : 'claim your reward',
        icon: progressPage ? faCheck : faPartyHorn,
      }
    : !user?.activeReward
      ? {
          text: 'setting a reward can be an excellent way of motivating yourself.',
          icon: undefined,
        }
      : reward.mode === 'reset'
        ? { text: 'reset', icon: faRotateRight }
        : // reward.mode === 'streak'
          { text: reward?.minCycles, icon: faFire };

  const handleRewardClick = () => {
    if (progressPage) return;

    // Open reward page
    if (isCompleted) return completeReward(reward._id);

    // Desktop modal
    if (query) {
      if (!user?.activeReward) return setSelectedReward('new');
      return setSelectedReward!(reward._id);
    }
    // Mobile page
    if (!user?.activeReward) return push('/reward/new');
    return push(`/reward/${reward._id}`);
  };

  return (
    <HardShadow animations={!progressPage}>
      <div className={styles.wrapper} onClick={handleRewardClick}>
        <div className={styles['relative-wrapper']}>
          <div className={styles.image}>
            <Image src={reward.image} layout="fill" alt={reward.name} />
            <div className={styles.shade} />
            <div className={styles.content}>
              <p className={styles.name}>{reward.name}</p>
              <p className={styles.mode}>
                {!!rewardContent.icon && (
                  <FontAwesomeIcon icon={rewardContent.icon} />
                )}{' '}
                {rewardContent.text}
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
                {progressPage
                  ? reward.totalCycles
                  : !user?.activeReward
                    ? '?'
                    : reward.totalCycles - reward.completedCycles}
              </p>
            </div>
            <p
              className={`${styles['cycles-left']} ${isCompleted ? styles.completed : ''}`}
            >
              Cycles{progressPage ? '' : ' left'}
            </p>
          </SmallProgressCircle>
          {rewardShapes.map((shape, i) => (
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
