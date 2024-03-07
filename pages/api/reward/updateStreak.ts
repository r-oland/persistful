import { UpdateRewardStreakTypes } from 'actions/reward/useUpdateRewardStreak';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
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
      const data = req.body as UpdateRewardStreakTypes;
      const { oldStreak, newStreak } = data;

      let completedReward = false;

      // If streak has changed, update active reward
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
        if (!reward) return;

        const getStreakDiffForStreakMode = () => {
          const streakDiff = newStreak - oldStreak;

          // Not in streak mode, ignore and return streakDiff
          if (!reward.minCycles || reward.mode !== 'streak') return streakDiff;

          const currentDailyStreak = (user.streak || 0) + newStreak;
          const dailyStreakBeforeUpdate = currentDailyStreak - streakDiff;

          // user has corrected previous input
          if (streakDiff < 0) return streakDiff;
          // Current streak was already greater then minCycles
          if (dailyStreakBeforeUpdate >= reward.minCycles) return streakDiff;
          // new daily streak is not high enough to satisfy minCycles
          if (reward.minCycles > currentDailyStreak) return 0;
          // daily streak was exactly matched with minCycles in this update
          if (currentDailyStreak === reward.minCycles) return 1;
          // daily streak was satisfied in this update, calculate how many cycles were completed since minCycles was satisfied
          if (currentDailyStreak > reward.minCycles)
            return currentDailyStreak + 1 - reward.minCycles;

          // Fallback
          return streakDiff;
        };

        const updatedCompletedCycles =
          reward.completedCycles + getStreakDiffForStreakMode();

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

        // Return whether reward was completed in this update to trigger modal in frontend
        if (completedCycles === reward.totalCycles) completedReward = true;
      }

      res.status(200).send({ completedReward });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
