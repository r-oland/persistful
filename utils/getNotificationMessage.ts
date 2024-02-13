const complementingNotifications = [
  {
    title: 'Goal Achieved! ',
    message: 'Great job reaching your goal today. Keep the momentum going!',
  },
  {
    title: 'Habit Master!',
    message:
      'You nailed it today! Let’s aim for another successful day tomorrow.',
  },
  {
    title: 'Streak Success!',
    message: 'Your streak is alive and well. Fantastic effort!',
  },
  {
    title: 'Consistency Wins!',
    message: 'Consistency is key, and today you proved it. Well done!',
  },
  {
    title: 'Habit Champion!',
    message:
      'Champion of habits, that’s what you are today. Celebrate your success!',
  },
  {
    title: 'Daily Target Hit!',
    message: 'Target met for the day. You’re on the right path!',
  },
  {
    title: 'Persistence Pays Off!',
    message: 'Your persistence is your superpower. Today is proof of that!',
  },
  {
    title: 'Achievement Unlocked!',
    message: 'Another achievement unlocked! Your dedication is admirable.',
  },
  {
    title: 'Success Story!',
    message:
      'Today’s success is a step towards your bigger goal. Proud of you!',
  },
];

const encouragingNotifications = [
  {
    title: 'Almost There!',
    message: 'You’re not far off. A little push can make today a win!',
  },
  {
    title: 'Habit Building!',
    message: 'Building habits takes time. Let’s make a small effort now!',
  },
  {
    title: 'Not Yet Complete!',
    message: 'Today’s not over yet. You can still reach your goal!',
  },
  {
    title: 'A Minor Setback!',
    message: 'Every day can’t be perfect. What matters is bouncing back!',
  },
  {
    title: 'Keep Pushing!',
    message: 'Just a little more effort to turn today around. You can do it!',
  },
  {
    title: 'Stay Motivated!',
    message:
      'Stay motivated. Your goals are within reach with a bit of effort!',
  },
  {
    title: 'You’ve Got This!',
    message:
      'Believe in yourself. You have what it takes to keep this streak going!',
  },
  {
    title: 'Opportunity Ahead!',
    message:
      'Today’s an opportunity to strengthen your resolve. Let’s do this!',
  },
];

const getRandomText = (
  texts: { title: string; message: string }[],
  streakReached: boolean
) => {
  const randomContent = texts[Math.floor(Math.random() * texts.length)];

  if (streakReached) randomContent.title = `🔥 ${randomContent.title}`;
  if (!streakReached) randomContent.title = `️🧊 ${randomContent.title}`;

  return randomContent;
};

export function getNotificationMessage(currentStreak: number) {
  if (currentStreak) return getRandomText(complementingNotifications, true);
  return getRandomText(encouragingNotifications, false);
}
