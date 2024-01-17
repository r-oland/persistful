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

    const _id = new ObjectId(req.query.rewardId as string) as any;
    const userId = new ObjectId(session?.user.uid) as any;

    const rewards = await getCollection<RewardEntity>('rewards');
    const users = await getCollection<UserEntity>('users');

    // update reward
    if (req.method === 'PUT') {
      const reward = await rewards.findOne({ _id });

      // remove activeReward from user object
      await users.findOneAndUpdate(
        { _id: userId },
        { $set: { activeReward: undefined } }
      );

      // set reward status to completed
      await rewards.findOneAndUpdate(
        { _id },
        { $set: { endDate: new Date(), completedCycles: reward?.totalCycles } }
      );

      res.status(200).send({ message: 'Reward completed' });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
