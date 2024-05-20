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

    if (req.method === 'GET') {
      // Get user id
      const _id = new ObjectId(session.user.uid) as any;

      // get user
      const users = await getCollection<UserEntity>('users');
      const user = await users.findOne({ _id });

      // get open rewards (rewards that are not claimed)
      const rewards = await getCollection<RewardEntity>('rewards');
      const openRewards = await rewards
        .aggregate([
          // no endDate means it's still open
          { $match: { userId: session.user.uid, endDate: { $exists: false } } },
          // Temporarily add isActiveReward field to sort on
          {
            $addFields: {
              isActiveReward: {
                $cond: [{ $eq: ['$_id', user?.activeReward] }, 1, 0],
              },
            },
          },
          // Sort on priority of listed fields
          { $sort: { isActiveReward: -1, completedCycles: -1, createdAt: -1 } },
          // Remove isActiveReward field after serving it's purpose in sort
          {
            $project: {
              isActiveReward: 0,
            },
          },
        ])
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
