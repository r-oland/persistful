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

    // get days
    const rewards = await getCollection<RewardEntity>('rewards');

    // Get user id
    const userId = session.user.uid;

    if (req.method === 'GET') {
      // get reward entities
      const result = await rewards
        .find({ userId, endDate: { $exists: true } })
        .sort({ createdAt: -1 })
        .toArray();

      // if entities exist,fetch days
      if (result.length) return res.status(200).send(result);

      // else return nothing
      return res.status(404).send({ message: 'not found' });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
