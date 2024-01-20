// Complementing Titles and Messages (for reaching daily goal)
const complementingTitles = [
  'Goal Unlocked!',
  'Habit Hero!',
  'Habit Masterclass!',
  'Habit Superstar!',
  'Goal Crusher Communique!',
];

const complementingMessages = [
  'Boom! You smashed your daily habit goal. Treat yourself to a victory dance!',
  'You did it! Consider your habit conquered for the day. High-fives all around!',
  "Ding ding ding! You've officially mastered today's habit challenge. Ready for an encore tomorrow?",
  'Gold star alert! You not only met but conquered your habit goal. Shine on, superstar!',
  'Congratulations! Your habit goal has officially been crushed. Time to celebrate your triumph!',
];

// Encouraging Titles and Messages (for not reaching daily goal)
const encouragingTitles = [
  'Oopsie-Daisy!',
  'Habit Hibernation!',
  'Goal MIA Alert!',
  'Lost in Habit-land!',
  'Habit Whisperer Needed!',
];

const encouragingMessages = [
  "Looks like we're still missing some habit love today. Ready to check-in and turn the day around?",
  'Your habit might be taking a little nap. Time to wake it up with a quick check-in!',
  'Your daily goal seems to be playing hide and seek. Ready to track it down and mark it off?',
  'Your habit might be exploring new territories. Give it a nudge with a check-in and guide it back!',
  'Your habit is being a bit shy today. Show it some love by logging your progress!',
];

const getRandomText = (texts: string[]) =>
  texts[Math.floor(Math.random() * texts.length)];

export function getNotificationMessage(currentStreak: number) {
  if (currentStreak)
    return {
      title: getRandomText(complementingTitles),
      message: getRandomText(complementingMessages),
    };

  return {
    title: getRandomText(encouragingTitles),
    message: getRandomText(encouragingMessages),
  };
}
