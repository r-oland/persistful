import { sub } from 'date-fns';
import { Collection, ObjectId, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getCollection } from 'utils/getMongo';
import { getStreakDays } from 'utils/validateStreaks/getStreakDays';
import { reset } from 'utils/validateStreaks/reset';

export type validateStreaksArgs = {
  req: NextApiRequest;
  res: NextApiResponse;
  userId: string;
  _id: string;
  users: Collection<UserEntity>;
  user: WithId<UserEntity>;
  days: WithId<DayEntity>[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if session exists
    const session = await checkAuth(req, res);
    if (!session) return;

    // get user
    const userId = session.user.uid;
    const _id = new ObjectId(userId) as any;
    const users = await getCollection<UserEntity>('users');
    const user = await users.findOne({ _id });
    const activeDay = new Date(req.body.activeDay);

    if (!user) return res.status(404).send('User not found');

    // Set last validated to today
    await users.updateOne({ _id }, { $set: { lastValidation: new Date() } });

    const dayCollection = await getCollection<DayEntity>('days');

    // Fetch all days before today
    const days = await dayCollection
      .find(
        { userId },
        // sort on most recent first
        { sort: { createdAt: -1 } }
      )
      .toArray();

    const { streakDays, secondChanceDates } = getStreakDays({
      days,
      user,
      skipToday: true,
    });

    const startDateGeneralStreak =
      streakDays[streakDays.length - 1]?.createdAt ||
      // fallback if streak was never broken -> grab first day
      streakDays[0]?.createdAt;

    const lastDayInStreak = new Date(
      Math.max(
        streakDays[0]?.createdAt?.getTime() || 0,
        secondChanceDates[0]?.getTime() || 0
      )
    ).toLocaleDateString();

    const yesterday = sub(new Date(), { days: 1 }).toLocaleDateString();

    if (lastDayInStreak !== yesterday)
      return reset({
        res,
        userId,
        _id,
        users,
        startDateGeneralStreak,
        activeDay,
      });

    // total sum of all completed streak day cycles
    const total = streakDays
      .map((day) => getDayAchievements(day).streak)
      .reduce((prev, cur) => prev + cur, 0);

    // update streak in user model
    await users.updateOne(
      { _id },
      { $set: { streak: total, secondChanceDates, startDateGeneralStreak } }
    );

    return res
      .status(200)
      .send({ message: 'streaks updated', startDateGeneralStreak });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
