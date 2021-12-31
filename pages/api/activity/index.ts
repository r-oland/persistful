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
      // Add new activity entity
      const result = await activities
        .insertOne({
          ...req.body,
          userId,
          createdAt: new Date(),
        })
        .then(async (r) => {
          // get user
          const _id = new ObjectId(userId);
          const users = await getCollection<UserEntity>('users');
          const user = await users.findOne({ _id });

          // update activity array in user
          return users.findOneAndUpdate(
            { _id },
            // @ts-ignore
            { $set: { activities: [...user.activities, r.insertedId] } }
          );
        });

      return res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
