// Components==============
import useGetUser from 'actions/user/useGetUser';
import useUpdateUser from 'actions/user/useUpdateUser';
import Checkbox from 'global_components/Checkbox/Checkbox';
import Slider from 'global_components/Slider/Slider';
import React, { useState } from 'react';
import styles from './Rules.module.scss';
// =========================

export default function Rules() {
  const { data: user } = useGetUser();
  const { mutate } = useUpdateUser();
  const rules = user?.rules;

  const [maxDailyGoal, setMaxDailyGoal] = useState(240);
  const [maxBonusTime, setMaxBonusTime] = useState(120);

  if (!rules) return null;

  const updateRules = (args: Partial<RulesEntity>) => {
    mutate({ rules: { ...rules, ...args } });
  };

  return (
    <div className={styles.wrapper}>
      <div>
        <strong>Daily goal</strong>
        <p className={styles.description}>
          The minimal amount of time that you need to reach in order to maintain
          your streak. This also determines the length of your streak cycles.
        </p>
        <Slider
          initialValue={rules.dailyGoal}
          onChange={(dailyGoal) => updateRules({ dailyGoal })}
          min={10}
          max={maxDailyGoal}
          increaseMax={setMaxDailyGoal}
          time
        />
      </div>
      <div>
        <strong>Second chance mode</strong>
        <Checkbox
          initialValue={rules.secondChange}
          onClick={(secondChange) => updateRules({ secondChange })}
        >
          <p>
            You're allowed to miss 1 day a week without breaking your streak.
          </p>
        </Checkbox>
      </div>
      <div>
        <strong>Enforced balance mode</strong>
        <Checkbox
          initialValue={!!rules.balance}
          onClick={(balance) => updateRules({ balance })}
        >
          <p>
            Your streak will only start counting after you've added time to at
            least 2 positive activities.
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
            You receive a bonus time by default. Performing a negative activity
            will remove this bonus.
          </p>
        </Checkbox>
      </div>
      {rules.prm && (
        <div>
          <strong>Bonus time</strong>
          <p className={styles.description}>
            The amount of time that gets rewarded to you if you have avoided all
            penalties in a day.
          </p>
          <Slider
            initialValue={rules.bonusTime}
            onChange={(bonusTime) => updateRules({ bonusTime })}
            min={10}
            max={maxBonusTime}
            increaseMax={setMaxBonusTime}
            time
          />
        </div>
      )}
    </div>
  );
}
