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

  const hour = new Date().getHours();

  const sentences = [
    // 0: streak = 0
    [
      hour > 4 && hour < 10
        ? `Good morning early bird! Let's get this party started!`
        : hour >= 10 && hour <= 14
        ? 'So you have a late start? You can still turn this around!'
        : hour > 14 && hour <= 24
        ? "Chop chop! time to get going, you don't have much time left."
        : // >= 0 && < 4
          "Shouldn't you be, oh I don't know, sleeping?",
    ],
    // 1: streak = 0 -  0.99
    [
      'One small step for... oh whatever, keep going!',
      `Starting out is the hardest part, I'm proud of you ${name}!`,
      hour >= 18
        ? "hey, you're trying! that's whats most important!"
        : 'Look at all that time you still got, keep pushing!',
    ],
    // 2:streak = 1 - 1.99
    [
      "Let's go! 1 down, 2 to go",
      hour > 15
        ? 'This is a nice pace, keep doing what your doing!'
        : "I'm impressed... Keep on marching soldier!",
    ],
    // 3: streak = 2 - 2.99
    [
      hour > 11 && hour < 18
        ? `Holy shit ${name}, you're killing it! 🔪`
        : hour >= 18 && hour <= 22
        ? `Dammn ${name}... you'r having a good day don't you?`
        : hour > 22 && hour <= 24
        ? "I'm biting my nails, could you still be able to make it..."
        : // <= 11
          'This is just straight up ridiculous... How can you be this good?',
    ],
    // 4: streak = > 3
    [
      `Hey hey, I'm proud of you but don't over do it buddy.`,
      'Today was awesome! I think you earned some rest.',
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
