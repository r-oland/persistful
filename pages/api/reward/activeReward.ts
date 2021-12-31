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

    const _id = new ObjectId(session.user.uid);

    if (req.method === 'GET') {
      // get active reward id from user
      const users = await getCollection<UserEntity>('users');
      const activeRewardId = await users
        .findOne({ _id })
        .then((u) => u?.activeReward);

      // get active reward with id from user model
      const rewards = await getCollection<RewardEntity>('rewards');
      const activeReward = await rewards.findOne({ _id: activeRewardId });

      // if it doesn't exist return nothing
      if (!activeReward) return res.status(204).send(undefined);

      // if it does return active reward
      return res.status(200).send(activeReward);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
