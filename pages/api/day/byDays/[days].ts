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
      const dates = req.query.days as string;

      const startDate = dates.split(' ')[0];
      const endDate = dates.split(' ')[1];

      const start = new Date(new Date(startDate).setUTCHours(0, 0, 0, 0));
      const end = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));

      // get range day entities
      const rangeDates = await days
        .find({ userId, createdAt: { $gte: start, $lt: end } })
        .toArray();

      // if entities exist,fetch days
      if (rangeDates.length) return res.status(200).send(rangeDates);

      // else return nothing
      return res.status(404).send({ message: 'not found' });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
