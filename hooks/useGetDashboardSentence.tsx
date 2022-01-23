// Components==============
import useGetUser from 'actions/user/useGetUser';
import { GlobalTodayStreakContext } from 'global_components/GlobalTodayStreakContextWrapper';
import { useContext, useEffect, useState } from 'react';
// =========================

export default function useGetDashboardSentence() {
  const { data: user } = useGetUser();
  const { todayStreak } = useContext(GlobalTodayStreakContext);

  const index =
    todayStreak === 0
      ? 0
      : todayStreak > 0 && todayStreak <= 0.99
      ? 1
      : todayStreak >= 1 && todayStreak <= 1.99
      ? 2
      : todayStreak >= 2 && todayStreak <= 2.99
      ? 3
      : todayStreak === 3
      ? 4
      : 0;

  const name = user?.firstName || 'person without a name';

  const sentences = [
    // 0: streak = 0
    [`Come on ${name} get on it...`, 'Chop chop! Time to get this ball roling'],
    // 1: streak = 0 -  0.99
    ['One small step for... oh whatever, keep going!'],
    // 2:streak = 1 - 1.99
    ['Hell yeah! Look at you, doing the minimal amount of work.'],
    // 3: streak = 2 - 2.99
    [`Holy shit ${name}, you're killing it! 🔪`],
    // 4: streak = > 3
    [
      `Hey hey, I'm proud of you but don't over do it buddy.`,
      'My god, bit of an overachiever are we?',
    ],
  ];

  const array = sentences[index];
  const i = Math.floor(Math.random() * array.length);

  const [sentence, setSentence] = useState(array[i]);

  useEffect(() => {
    setSentence(array[i]);
  }, [index, name]);

  return sentence;
}
