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
    const days = await getCollection<Omit<DayEntity, '_id'>>('days');

    // Get user id
    const userId = session.user.uid;

    if (req.method === 'GET') {
      const data = await days
        .aggregate([
          { $match: { userId } },
          // Only show activities with count > 0
          {
            $addFields: {
              activities: {
                $filter: {
                  input: '$activities',
                  as: 'activity',
                  cond: { $gt: ['$$activity.count', 0] },
                },
              },
            },
          },
          { $sort: { createdAt: 1 } },
        ])
        .toArray();

      // fetch days
      return res.status(200).send(data);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
