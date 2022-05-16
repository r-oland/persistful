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
    const days = await getCollection<DayEntity>('days');

    // Get user id
    const userId = session.user.uid;

    if (req.method === 'GET') {
      const date = req.query.day as string;

      const start = setDateTime(new Date(date), 'start');
      const end = setDateTime(new Date(date), 'end');

      // get todays day entity if it already exists
      const today = await days.findOne({
        userId,
        createdAt: { $gte: start, $lt: end },
      });

      // if it exists,fetch day
      if (today) return res.status(200).send(today);

      // else return nothing
      return res.status(200).send(undefined);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
