import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await checkAuth(req, res);

    // get reward with status of active
    if (req.method === 'GET') {
      const rewards = await getCollection<RewardEntity>('rewards');

      const result = await rewards.findOne({ status: 'active' });

      if (result) return res.status(200).send(result);

      return res.status(204).send(undefined);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
