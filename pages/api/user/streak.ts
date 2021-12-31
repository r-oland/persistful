import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getCollection } from 'utils/getMongo';
import { checkAuth } from 'utils/checkAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if session exists
    const session = await checkAuth(req, res);
    if (!session) return;

    // Get user id
    const _id = new ObjectId(session.user.uid);

    // get users
    const users = await getCollection<UserEntity>('users');

    const incValue = req.body.direction === 'inc' ? 1 : -1;

    if (req.method === 'PUT') {
      // find user and update streak
      const result = await users.updateOne(
        { _id },
        { $inc: { streak: incValue } }
      );

      const rewards = await getCollection<RewardEntity>('rewards');
      const activeRewardId = await users
        .findOne({ _id })
        .then((u) => u?.activeReward);

      // update reward streak if it exists
      if (activeRewardId) {
        const activeReward = await rewards.findOne({ _id: activeRewardId });

        // if active reward exists but it isn't completed yet, increment
        if (
          activeReward &&
          activeReward.completedCycles !== activeReward.totalCycles
        )
          await rewards.updateOne(
            { _id: activeRewardId },
            { $inc: { completedCycles: incValue } }
          );
      }

      return res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
