import { Collection } from 'mongodb';
import { NextApiResponse } from 'next';
import { checkIfActivityIsUpdatedInStreak } from 'utils/checkIfActivityIsUpdatedInStreak';
import { getCollection } from 'utils/getMongo';

export async function reset({
  res,
  userId,
  _id,
  users,
  startDateGeneralStreak,
  activeDay,
}: {
  res: NextApiResponse;
  userId: string;
  _id: string;
  users: Collection<UserEntity>;
  startDateGeneralStreak?: Date;
  activeDay: Date;
}) {
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

  const activityIsUpdatedInStreak = checkIfActivityIsUpdatedInStreak(
    activeDay,
    startDateGeneralStreak
  );

  // Check if day was edited that is part of the current streak
  if (!activityIsUpdatedInStreak)
    return res.status(200).send({ message: 'Streaks reset' });

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

  return res.status(200).send({ message: 'Streaks reset & rewards reset' });
}
