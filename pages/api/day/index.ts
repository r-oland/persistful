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
    const days = await getCollection<DayEntity>('days');

    // Get user id
    const userId = session.user.uid;

    if (req.method === 'GET') {
      const data = await days.find({ userId }).toArray();

      // fetch days
      return res.status(200).send(data);
    }

    if (req.method === 'POST') {
      // Get activities snapshot to day entity
      const activities = await getCollection<ActivityEntity>('activities');
      const activitySnapshot = await activities
        .find({ userId })
        .map((activity) => ({ activity, count: 0 } as DailyActivityEntity))
        .toArray();

      // Add new day entity
      const result = await days.insertOne({
        ...req.body,
        activities: activitySnapshot,
        userId,
        createdAt: new Date(),
      });

      return res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
