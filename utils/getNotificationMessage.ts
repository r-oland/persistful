// Complementing Titles and Messages (for reaching daily goal)
const complementingTitles = [
  'Goal Unlocked!',
  'Habit Hero!',
  'Habit Superstar!',
  'Goal Crusher!',
  'Habit Ninja Strikes Again!',
  'Daily Goal Dominated!',
  'Habit Overlord at Work!',
  'Goal Gladiator Triumphs!',
  'Habit Whiz!',
];

const complementingMessages = [
  'Boom! You smashed your daily habit goal. Treat yourself to a victory dance!',
  'You did it! Consider your habit conquered for the day. High-fives all around!',
  "Ding ding ding! You've officially mastered today's habit challenge. Ready for an encore tomorrow?",
  'Gold star alert! You not only met but conquered your habit goal. Shine on, superstar!',
  'Congratulations! Your habit goal has officially been crushed. Time to celebrate your triumph!',
  'Another day, another habit conquered. You are the true Habit Ninja!',
  'Daily goal, consider yourself officially dominated. Ready for tomorrow’s challenge?',
  'Witness the power of the Habit Overlord! Your daily goal is no match for your prowess!',
  "Goal Gladiator, you've triumphed again! The habit arena is yours for the taking.",
  "In the Chronicles of Habit, today's entry is all about your epic conquest. Well done!",
  "You’re a Habit Maestro! Today's performance is worthy of a standing ovation.",
];

// Encouraging Titles and Messages (for not reaching daily goal)
const encouragingTitles = [
  'Oopsie-Daisy!',
  'Habit Hibernation!',
  'Goal MIA Alert!',
  'Lost in Habit-land!',
  'Habit Whisperer Needed!',
  'Goal Resilience Reminder!',
  'Daily Goal, Round Two!',
  'Quest for the Goal Continues!',
];

const encouragingMessages = [
  "Looks like we're still missing some habit love today. Ready to check-in and turn the day around?",
  'Your habit might be taking a little nap. Time to wake it up with a quick check-in!',
  'Your daily goal seems to be playing hide and seek. Ready to track it down and mark it off?',
  'Your habit might be exploring new territories. Give it a nudge with a check-in and guide it back!',
  'Your habit is being a bit shy today. Show it some love by logging your progress!',
  'The quest for the goal continues! Your dedication is the key to habit triumphs.',
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
