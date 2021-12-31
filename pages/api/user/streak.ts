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
      // update reward streak if it exists
      if (req.body.activeRewardId) {
        const rewards = await getCollection<RewardEntity>('rewards');
        const activeRewardId = new ObjectId(req.body.activeRewardId);
        const activeReward = await rewards.findOne({ _id: activeRewardId });

        // if active reward doesn't exist or it's status is completed already, return
        if (!activeReward || activeReward?.status === 'completed') return;

        const completed =
          activeReward.completedCycles + incValue === activeReward.totalCycles;

        const updateValue = completed
          ? // set status
            { $set: { status: 'completed' } }
          : // increment / decrement value
            { $inc: { completedCycles: incValue } };

        // @ts-ignore
        rewards.updateOne({ _id: activeRewardId }, updateValue);
      }

      // find user and update streak
      const result = await users.updateOne(
        { _id },
        { $inc: { streak: incValue } }
      );

      return res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
