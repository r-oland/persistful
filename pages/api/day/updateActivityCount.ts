import { UpdateActivityCountTypes } from 'actions/day/useUpdateActivityCount';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { checkAuth } from 'utils/checkAuth';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getCollection } from 'utils/getMongo';

async function updateActiveReward(
  session: Session,
  oldStreak: number,
  newStreak: number
) {
  // Get user
  const userId = new ObjectId(session.user.uid) as any;
  const users = await getCollection<UserEntity>('users');
  const user = await users.findOne({ _id: userId });

  // Nothing to update if user has no active reward
  if (!user?.activeReward) return;

  // get rewards
  const rewards = await getCollection<RewardEntity>('rewards');

  const reward = await rewards.findOne({ _id: user.activeReward });
  if (!reward) return;

  const updatedCompletedCycles = reward.completedCycles + newStreak - oldStreak;

  const completedCycles =
    updatedCompletedCycles < 0
      ? // Prevent negative values
        0
      : updatedCompletedCycles > reward.totalCycles
        ? // Prevent values higher than totalCycles
          reward.totalCycles
        : updatedCompletedCycles;

  // Update active reward with newly calculated completedCycles
  await rewards.findOneAndUpdate(
    { _id: user.activeReward },
    { $set: { completedCycles } }
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if session exists
    const session = await checkAuth(req, res);
    if (!session) return;

    if (req.method === 'PUT') {
      const data = req.body as UpdateActivityCountTypes;

      // get day
      const days = await getCollection<DayEntity>('days');
      const _id = new ObjectId(data.id) as any;
      const day = await days.findOne({ _id });
      if (!day) return res.status(404).send({ message: 'day not found' });

      // get activity
      const activities = await getCollection<ActivityEntity>('activities');
      const activityId = new ObjectId(data.activityId) as any;
      const activity = await activities.findOne({ _id: activityId });
      if (!activity)
        return res.status(404).send({ message: 'activity not found' });

      // set new count value to activity entity
      await activities.updateOne(
        { _id: activityId },
        { $set: { count: activity.count + data.value } }
      );

      // calculate new activities array
      const newValue = day.activities.map((a) =>
        // @ts-ignore
        a._id.equals(data.activityId)
          ? { ...a, count: a.count + data.value }
          : a
      );

      // set new count value to day entity
      const result = await days.findOneAndUpdate(
        { _id },
        { $set: { activities: newValue } },
        { upsert: true }
      );

      // Calculate difference in streak to update reward
      const oldStreak = getDayAchievements(day).streak;
      const newStreak = getDayAchievements({
        ...day,
        activities: newValue,
      }).streak;

      // If streak has changed, update active reward
      if (oldStreak !== newStreak)
        await updateActiveReward(session, oldStreak, newStreak);

      res.status(200).send({ ...result.value, ...data });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
