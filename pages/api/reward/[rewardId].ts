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

    if (req.method === 'PUT') {
      const data = req.body;
      delete data.id;

      const result = await rewards.findOneAndUpdate(
        { _id },
        { $set: data },
        { upsert: true }
      );

      res.status(200).send({ ...result.value, ...data });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
