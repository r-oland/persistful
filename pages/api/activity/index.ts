import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if session exists
    const session = await checkAuth(req, res);
    if (!session) return;

    // get activities
    const activities = await getCollection<ActivityEntity>('activities');

    // Get user id
    const userId = session.user.uid;

    if (req.method === 'GET') {
      const data = await activities
        .find({ userId, status: 'active' || 'inactive' })
        .toArray();

      // fetch activities
      return res.status(200).send(data);
    }

    if (req.method === 'POST') {
      const alreadyExists = await activities.findOne({
        name: req.body?.name,
        userId,
      });

      // if activity already exists ignore rest of post action and set status to active
      if (alreadyExists) {
        activities.findOneAndUpdate(
          { name: req.body?.name, userId },
          { $set: { status: 'active' } }
        );

        return res
          .status(200)
          .send({ _id: alreadyExists._id, message: 'activity already exists' });
      }

      // Add new activity entity
      const result = await activities
        .insertOne({
          ...req.body,
          userId,
          count: 0,
          createdAt: new Date(),
        })
        .then(async (r) => {
          // Add new activity entity to today's day entity
          const days = await getCollection<DayEntity>('days');
          const start = new Date(new Date().setUTCHours(0, 0, 0, 0));
          const end = new Date(new Date().setUTCHours(23, 59, 59, 999));

          const today = await days.findOne({
            userId: session.user.uid,
            createdAt: { $gte: start, $lt: end },
          });

          if (today)
            await days.findOneAndUpdate(
              {
                userId: session.user.uid,
                createdAt: { $gte: start, $lt: end },
              },
              {
                $set: {
                  activities: [
                    ...today.activities,
                    {
                      _id: r.insertedId,
                      count: 0,
                      countMode: req.body?.countMode,
                      countCalc: req.body?.countCalc,
                      penalty: req.body?.penalty,
                    },
                  ],
                },
              }
            );

          return r;
        });

      return res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
