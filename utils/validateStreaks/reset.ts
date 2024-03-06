import { validateStreaksArgs } from 'pages/api/user/validateStreaks';
import { getCollection } from 'utils/getMongo';

export function resetStreaks({ res, userId, _id, users }: validateStreaksArgs) {
  return async () => {
    await users.updateOne(
      { _id },
      {
        $set: {
          streak: 0,
          secondChanceDates: undefined,
          startDateGeneralStreak: undefined,
        },
      }
    );

    const rewards = await getCollection<RewardEntity>('rewards');

    // reset all open rewards with a streak mode of reset
    await rewards.updateMany(
      {
        userId,
        mode: 'reset',
        endDate: { $exists: false },
      },
      { $set: { completedCycles: 0 } }
    );

    return res.status(200).send({ message: 'Streaks reset' });
  };
}
