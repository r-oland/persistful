import { UpdateActivityCountTypes } from 'actions/day/useUpdateActivityCount';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getCollection } from 'utils/getMongo';

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

      // Calculate difference in streak
      const oldStreak = getDayAchievements(day).streak;
      const newStreak = getDayAchievements({
        ...day,
        activities: newValue,
      }).streak;

      // If streak has changed, and user has an active reward set: update reward
      if (oldStreak !== newStreak) {
        // Get user
        const userId = new ObjectId(session.user.uid) as any;
        const users = await getCollection<UserEntity>('users');
        const user = await users.findOne({ _id: userId });

        // Nothing to update if user has no active reward
        if (!user?.activeReward) return;

        // get rewards
        const rewards = await getCollection<RewardEntity>('rewards');

        const reward = await rewards.findOne({ _id: user.activeReward });
        const updatedCompletedCycles =
          (reward?.completedCycles || 0) + newStreak - oldStreak;
        // Prevent negative values
        const completedCycles =
          updatedCompletedCycles < 0 ? 0 : updatedCompletedCycles;

        // Update active reward with newly calculated completedCycles
        await rewards.findOneAndUpdate(
          { _id: user.activeReward },
          { $set: { completedCycles } }
        );
      }

      // set new count value to day entity
      const result = await days.findOneAndUpdate(
        { _id },
        { $set: { activities: newValue } },
        { upsert: true }
      );

      res.status(200).send({ ...result.value, ...data });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
