// Components==============
import { faPartyHorn } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useCompleteReward from 'actions/reward/useCompleteReward';
import useGetOpenRewards from 'actions/reward/useGetOpenRewards';
import useGetUser from 'actions/user/useGetUser';
import Button from 'global_components/Button/Button';
import Modal from 'global_components/Modal/Modal';
import Image from 'next/legacy/image';
import React from 'react';
import styles from './CompletedRewardModal.module.scss';
// =========================

function getRandomRewardMessage(activeReward: RewardEntity) {
  const rewardMessages = [
    {
      title: <h3>Outstanding Achievement!</h3>,
      text: (
        <p>
          You've truly outdone yourself by earning the{' '}
          <b>{activeReward.name}</b> reward! The dedication to complete{' '}
          <b>{activeReward.totalCycles} cycles</b> is nothing short of
          inspiring. Time to bask in the glory of your success!
        </p>
      ),
    },
    {
      title: <h3>Bravo! You Did It!</h3>,
      text: (
        <p>
          What a journey it's been to your <b>{activeReward.name}</b>! Every one
          of those <b>{activeReward.totalCycles} cycles</b> was a step towards
          this moment of victory. Take pride in your steadfast commitment!
        </p>
      ),
    },
    {
      title: <h3>Victory Lap!</h3>,
      text: (
        <p>
          Each cycle was a challenge, but you've mastered them all to earn the{' '}
          <b>{activeReward.name}</b>! Your streak of{' '}
          <b>{activeReward.totalCycles} cycles</b> is a testament to your
          unwavering resolve. Keep up the fantastic momentum!
        </p>
      ),
    },
    {
      title: <h3>Congratulations, Champion!</h3>,
      text: (
        <p>
          The <b>{activeReward.name}</b> is now yours! You've turned{' '}
          <b>{activeReward.totalCycles} cycles</b> of effort into a triumph.
          This is a moment to celebrate—your perseverance has paid off
          gloriously!
        </p>
      ),
    },
    {
      title: <h3>High Five!</h3>,
      text: (
        <p>
          You nailed it! The <b>{activeReward.name}</b> has your name on it. All
          those <b>{activeReward.totalCycles} cycles</b> show just how awesome
          you are. Go ahead, claim your well-deserved reward with a smile!
        </p>
      ),
    },
  ];

  const randomIndex = Math.floor(Math.random() * rewardMessages.length);
  return rewardMessages[randomIndex];
}

export default function CompletedRewardModal({
  setModalIsOpen,
}: {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { data: user } = useGetUser();
  const { data: openRewards } = useGetOpenRewards();
  const { mutate: completeReward } = useCompleteReward();

  const activeReward = openRewards?.find((r) => r._id === user?.activeReward);

  if (!activeReward) return null;

  const message = getRandomRewardMessage(activeReward);

  return (
    <Modal color="green" setModalIsOpen={setModalIsOpen}>
      <div className={styles.wrapper}>
        <div className={styles.image}>
          <Image
            src={activeReward.image}
            layout="fill"
            alt={activeReward.name}
          />
        </div>
        <div className={styles.content}>
          {message.title}
          {message.text}
          <Button
            color="green"
            onClick={() => {
              completeReward(activeReward._id);
              setModalIsOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faPartyHorn} /> Claim reward
          </Button>
        </div>
      </div>
    </Modal>
  );
}
