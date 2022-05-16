import { ObjectId } from 'mongodb';
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

    // Get user id
    const _id = new ObjectId(session.user.uid);

    // get user
    const users = await getCollection<UserEntity>('users');
    const user = await users.findOne({ _id });

    // if user doesn't match session abort
    if (!user) return res.status(401).send('User not found');

    if (req.method === 'GET') {
      return res.status(200).send(user);
    }

    if (req.method === 'PUT') {
      // if rules change, also change it in today's day entity
      if (req.body?.rules) {
        const days = await getCollection<DayEntity>('days');
        const start = setDateTime(new Date(), 'start');
        const end = setDateTime(new Date(), 'end');

        await days.findOneAndUpdate(
          {
            userId: session.user.uid,
            createdAt: { $gte: start, $lt: end },
          },
          { $set: { rules: req.body?.rules } }
        );
      }

      // find user and update dep on request body
      const result = await users.findOneAndUpdate(
        { _id },
        { $set: req.body },
        { upsert: true }
      );

      res.status(200).send({ ...result.value, ...req.body });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
