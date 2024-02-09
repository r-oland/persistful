import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';

function moveActiveRewardToFront(
  rewards: RewardEntity[],
  activeRewardId?: string
) {
  if (!activeRewardId) return rewards;

  const activeReward = rewards.find(
    (r) => r._id?.toString() === activeRewardId?.toString()
  );

  if (activeReward) {
    const index = rewards.indexOf(activeReward);
    rewards.splice(index, 1);
    rewards.unshift(activeReward);
  }
  return rewards;
}

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
        .find({
          userId: session.user.uid,
          // no endDate means it's still open
          endDate: { $exists: false },
        })
        .sort({ createdAt: -1 })
        .toArray()
        .then((r) => moveActiveRewardToFront(r, user?.activeReward));

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
