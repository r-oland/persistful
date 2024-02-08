// Components==============
import { motion } from 'framer-motion';
import Calendar from 'global_components/Calendar/Calendar';
import RewardCard from 'global_components/RewardCard/RewardCard';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import React, { useEffect, useRef, useState } from 'react';
import { framerTopNavChild, framerTopNavParent } from 'utils/framerAnimations';
import Button from 'global_components/Button/Button';
import { useRouter } from 'next/router';
import useGetOpenRewards from 'actions/reward/useGetOpenRewards';
import { useMediaQ } from 'hooks/useMediaQ';
import { TopNavSelectedOption } from '../GeneralTopNav';
import styles from './Items.module.scss';
// =========================

function Reward({
  setSelectedReward,
}: {
  setSelectedReward: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data: openRewards } = useGetOpenRewards();

  const query = useMediaQ('min', 768);
  const { push } = useRouter();

  return (
    <motion.div
      className={styles['rewards-section']}
      variants={framerTopNavChild}
    >
      <h3 className={styles.title}>Rewards</h3>
      <div className={styles.rewards}>
        {openRewards?.map((openReward) => (
          <RewardCard
            key={openReward._id}
            reward={openReward}
            setSelectedReward={setSelectedReward}
          />
        ))}
      </div>
      <Button
        color="white"
        onClick={() => (query ? setSelectedReward('new') : push('/reward/new'))}
      >
        New Reward
      </Button>
    </motion.div>
  );
}

function CalendarComp({
  activeDay,
  setActiveDay,
  overview,
}: {
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
  overview?: boolean;
}) {
  return (
    <motion.div variants={framerTopNavChild}>
      <Calendar
        activeDay={activeDay}
        setActiveDay={setActiveDay}
        week={overview}
      />
    </motion.div>
  );
}

export default function Items({
  selected,
  setSelected,
  selectedReward,
  setSelectedReward,
  activeDay,
  setActiveDay,
  overview,
}: {
  selected: TopNavSelectedOption;
  setSelected: React.Dispatch<React.SetStateAction<TopNavSelectedOption>>;
  selectedReward: string;
  setSelectedReward: React.Dispatch<React.SetStateAction<string>>;
  activeDay: Date;
  setActiveDay: React.Dispatch<React.SetStateAction<Date>>;
  overview?: boolean;
}) {
  const ref = useRef(null);

  useOnClickOutside({
    refs: [ref],
    handler: () => {
      setSelected('none');
    },
  });

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(1);
    if (key === 0) return;

    setSelected('none');
  }, [activeDay]);

  useEffect(() => {
    if (selectedReward !== 'initial') setSelected('none');
  }, [selectedReward]);

  return (
    <motion.div
      initial="hidden"
      exit="hidden"
      animate="show"
      variants={framerTopNavParent}
      className={`${styles.wrapper} ${styles[selected]}`}
      ref={ref}
    >
      {selected === 'bar' ? (
        <>
          <CalendarComp
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            overview={overview}
          />
          <Reward setSelectedReward={setSelectedReward} />
        </>
      ) : selected === 'streak' ? (
        <Reward setSelectedReward={setSelectedReward} />
      ) : selected === 'calendar' ? (
        <CalendarComp
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          overview={overview}
        />
      ) : (
        <></>
      )}
    </motion.div>
  );
}
