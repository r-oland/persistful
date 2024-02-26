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
      const dates = req.query.days as string;

      const startDate = dates.split(' ')[0];
      const endDate = dates.split(' ')[1];

      const start = setDateTime(new Date(startDate), 'start');
      const end = setDateTime(new Date(endDate), 'end');

      // get range day entities
      const rangeDates = await days
        .find({ userId, createdAt: { $gte: start, $lt: end } })
        .toArray();

      return res.status(200).send(rangeDates);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
