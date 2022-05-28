import type { NextApiRequest, NextApiResponse } from 'next';
import { getCollection } from 'utils/getMongo';
import { checkAuth } from 'utils/checkAuth';
import { setDateTime } from 'utils/setDateTime';

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
      const dates = req.query.days as string;

      const startDate = dates.split(' ')[0];
      const endDate = dates.split(' ')[1];

      const start = setDateTime(new Date(startDate), 'start');
      const end = setDateTime(new Date(endDate), 'end');

      // get range reward entities
      const rangeRewards = await rewards
        .find({ userId, endDate: { $gte: start, $lt: end } })
        .sort({ createdAt: -1 })
        .toArray();

      // if entities exist,fetch days
      if (rangeRewards.length) return res.status(200).send(rangeRewards);

      // else return nothing
      return res.status(404).send({ message: 'not found' });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
