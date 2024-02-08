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

    if (req.method === 'GET') {
      // get open rewards (rewards that are not claimed)
      const rewards = await getCollection<RewardEntity>('rewards');
      const openRewards = await rewards
        .find({
          userId: session.user.uid,
          // no endDate means it's still open
          endDate: { $exists: false },
        })
        .sort({ createdAt: -1 })
        .toArray();

      // if they doen't exist, return nothing
      if (!openRewards.length) return res.status(200).send([]);

      // if it does return active reward
      return res.status(200).send(openRewards);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
