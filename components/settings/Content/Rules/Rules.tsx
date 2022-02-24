// Components==============
import useGetUser from 'actions/user/useGetUser';
import useUpdateUser from 'actions/user/useUpdateUser';
import { AnimatePresence, motion } from 'framer-motion';
import Checkbox from 'global_components/Checkbox/Checkbox';
import Slider from 'global_components/Slider/Slider';
import React from 'react';
import { framerFade } from 'utils/framerAnimations';
import styles from './Rules.module.scss';
// =========================

export default function Rules() {
  const { data: user } = useGetUser();
  const { mutate } = useUpdateUser();
  const rules = user?.rules;

  if (!rules) return null;

  const updateRules = (args: Partial<RulesEntity>) => {
    mutate({ rules: { ...rules, ...args } });
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <strong>Daily goal</strong>
        <p className={styles.description}>
          The minimal amount of hours that you need to hit in order to maintain
          your streak. This also determines the length of your streak cycles.
        </p>
        <Slider
          initialValue={rules.dailyGoal}
          onChange={(dailyGoal) => updateRules({ dailyGoal })}
          min={10}
          max={240}
          time
        />
      </div>
      <div>
        <strong>Second chance</strong>
        <Checkbox
          initialValue={rules.secondChange}
          onClick={(secondChange) => updateRules({ secondChange })}
        >
          <p>
            You're allowed to miss 1 day a weak without breaking your streak.
          </p>
        </Checkbox>
      </div>
      <div>
        <strong>Positive reinforcement mode</strong>
        <Checkbox
          initialValue={rules.prm}
          onClick={(prm) => updateRules({ prm })}
        >
          <p>
            You receive bonus points for not engaging in negative activities.
          </p>
        </Checkbox>
      </div>
      <AnimatePresence>
        {rules.prm && (
          <motion.div {...framerFade}>
            <strong>Bonus time</strong>
            <p className={styles.description}>
              The amount of time that get's rewarded to you if you have avoided
              all penalties.
            </p>
            <Slider
              initialValue={rules.bonusTime}
              onChange={(bonusTime) => updateRules({ bonusTime })}
              min={10}
              max={120}
              time
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
