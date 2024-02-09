import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await checkAuth(req, res);
    if (!session) return;

    const _id = new ObjectId(req.query.rewardId as string) as any;
    const userId = new ObjectId(session?.user.uid) as any;

    const rewards = await getCollection<RewardEntity>('rewards');
    const users = await getCollection<UserEntity>('users');

    // update reward
    if (req.method === 'PUT') {
      const openRewards = await rewards
        .find({
          // Not the reward we're updating
          _id: { $ne: _id },
          userId: session.user.uid,
          // no endDate means it's still open
          endDate: { $exists: false },
        })
        .sort({ createdAt: -1 })
        .toArray();

      // remove activeReward from user object
      await users.findOneAndUpdate(
        { _id: userId },
        // Set first open reward as active reward if it exists, if it doesn't -> undefined
        { $set: { activeReward: openRewards?.[0]?._id } }
      );

      // set reward status to completed
      await rewards.findOneAndUpdate(
        { _id },
        { $set: { endDate: new Date() } }
      );

      res.status(200).send({ message: 'Reward completed' });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
