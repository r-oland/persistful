import type { NextApiRequest, NextApiResponse } from 'next';
import { getCollection } from 'utils/getMongo';
import { checkAuth } from 'utils/checkAuth';
import { ObjectId } from 'mongodb';

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
      const data = await days.find({ userId }).toArray();

      // fetch days
      return res.status(200).send(data);
    }

    if (req.method === 'POST') {
      // Get activities snapshot to day entity to -> persist calc data for that day & enable displaying of deleted activities
      const activities = await getCollection<ActivityEntity>('activities');
      const activitySnapshot = await activities
        .find({ userId })
        // Filter out the only values (next to the _id) that are needed
        .project({ countCalc: 1, countMode: 1, penalty: 1 })
        .map((activity) => ({ ...activity, count: 0 }) as DailyActivityEntity)
        .toArray();

      // get user
      const users = await getCollection<UserEntity>('users');
      const _id = new ObjectId(userId) as any;
      const user = await users.findOne({ _id });
      if (!user) return;

      // get current active date from request
      const activeDate = req.body as Date;

      // Add new day entity
      const result = await days.insertOne({
        activities: activitySnapshot,
        userId,
        createdAt: new Date(activeDate),
        rules: user.rules,
      });

      return res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
