// Components==============
import { motion } from 'framer-motion';
import { useOnClickOutside } from 'hooks/useOnClickOutside';
import { DashboardContext } from 'pages';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { framerTopNavParent } from 'utils/framerAnimations';
import { TopNavSelectedOption } from '../TopNav';
import Calendar from './Calendar';
import styles from './Items.module.scss';
import Reward from './Reward';
// =========================

export default function Items({
  selected,
  setSelected,
  selectedReward,
  setSelectedReward,
  page,
}: {
  selected: TopNavSelectedOption;
  setSelected: React.Dispatch<React.SetStateAction<TopNavSelectedOption>>;
  selectedReward: string;
  setSelectedReward: React.Dispatch<React.SetStateAction<string>>;
  page: 'dashboard' | 'progress';
}) {
  const ref = useRef(null);

  const { activeDay } = useContext(DashboardContext);

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
          <Calendar page={page} />
          <Reward page={page} setSelectedReward={setSelectedReward} />
        </>
      ) : selected === 'streak' ? (
        <Reward page={page} setSelectedReward={setSelectedReward} />
      ) : selected === 'calendar' ? (
        <Calendar page={page} />
      ) : (
        <></>
      )}
    </motion.div>
  );
}
