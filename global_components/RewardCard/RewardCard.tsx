// Components==============
import useCompleteReward from 'actions/reward/useCompleteReward';
import Button from 'global_components/Button/Button';
import HardShadow from 'global_components/HardShadow/HardShadow';
import Shape from 'global_components/Shape/Shape';
import SmallProgressCircle from 'global_components/SmallProgressCircle/SmallProgressCircle';
import useGetRewardCycles from 'hooks/useGetRewardCycles';
import { useMediaQ } from 'hooks/useMediaQ';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import React from 'react';
import { format } from 'date-fns';
import styles from './RewardCard.module.scss';
import { shapes } from './shapes';
// =========================

export default function RewardCard({
  reward,
  setModalIsOpen,
  overview,
}: {
  reward: RewardEntity;
  setModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  overview?: boolean;
}) {
  const completeReward = useCompleteReward();
  const query = useMediaQ('min', 768);
  const { push } = useRouter();

  const completedCycles = useGetRewardCycles(reward);
  const isCompleted = completedCycles >= reward.totalCycles;

  const status = overview ? 'overview' : isCompleted ? 'completed' : 'active';

  return (
    <HardShadow stretch>
      <div className={styles.wrapper}>
        <div className={styles.image}>
          <Image src={reward.image} layout="fill" alt={reward.name} />
        </div>
        <div className={styles.content}>
          <div className={styles.bottom}>
            <div className={styles.top}>
              <div>
                <p className={styles.title}>
                  {status === 'completed' ? 'Nice work!' : reward.name}
                </p>
                {status === 'completed' && (
                  <p className={styles.description}>That was impressive</p>
                )}
              </div>
              {status === 'overview' && (
                <div className={styles.dates}>
                  <p>
                    <strong>Start date:</strong>{' '}
                    {format(new Date(reward.createdAt), 'dd MMM yyyy')}
                  </p>
                  <p>
                    <strong>End date:</strong>{' '}
                    {format(new Date(reward.endDate!), 'dd MMM yyyy')}
                  </p>
                </div>
              )}
              {!!setModalIsOpen && (
                <>
                  {status === 'completed' ? (
                    <Button
                      color="green"
                      onClick={() => completeReward.mutate(reward._id)}
                    >
                      Claim
                    </Button>
                  ) : (
                    <Button
                      color="white"
                      onClick={() =>
                        query
                          ? setModalIsOpen(true)
                          : push(`/reward/${reward._id}`)
                      }
                    >
                      View
                    </Button>
                  )}
                </>
              )}
            </div>
            <SmallProgressCircle
              percentage={
                status === 'completed' || status === 'overview'
                  ? 100
                  : (100 / reward.totalCycles) * completedCycles
              }
              color={status === 'completed' ? 'green' : 'black'}
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
                    fill={status === 'completed' ? '#18e597' : '#282F36'}
                  />
                </svg>
                <p className={styles.count}>
                  {status === 'overview'
                    ? reward.totalCycles
                    : status === 'completed'
                      ? 0
                      : reward.totalCycles - completedCycles}
                </p>
              </div>
              <p className={styles['cycles-left']}>
                Cycles {status !== 'overview' ? 'left' : ''}
              </p>
            </SmallProgressCircle>
          </div>
          {shapes.map((shape, i) => (
            <Shape info={shape} color="grey" key={i} />
          ))}
        </div>
      </div>
    </HardShadow>
  );
}
