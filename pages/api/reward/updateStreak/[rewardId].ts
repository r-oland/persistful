import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await checkAuth(req, res);

    const _id = new ObjectId(req.query.rewardId as string);

    const rewards = await getCollection<RewardEntity>('rewards');

    // update reward
    if (req.method === 'PUT') {
      const reward = await rewards.findOne({ _id });
      if (!reward) return res.status(404).send({ message: 'No reward found' });

      const newValue = reward.completedCycles + req.body.difference;
      const completedCycles = newValue < 0 ? 0 : newValue;

      // set reward status to completed
      await rewards.findOneAndUpdate(
        { _id },
        {
          $set: {
            completedCycles,
          },
        }
      );

      res.status(200).send({ message: 'Reward completed' });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
