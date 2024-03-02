import type { NextApiRequest, NextApiResponse } from 'next';
import { getCollection } from 'utils/getMongo';

const CRON_API_KEY = process.env.CRON_API_KEY as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const encodedKey = (req.headers.authorization as string).slice(6); // Remove 'Basic ' prefix
    const decodedKey = Buffer.from(encodedKey, 'base64').toString('utf8');

    // check if authorization header matches CRON API KEY
    if (decodedKey !== CRON_API_KEY)
      return res.status(401).send('Not authorized');

    // Retrieve days from database
    const days = await getCollection<DayEntity>('days');

    if (req.method === 'POST') {
      const daysWithoutActivity = await days
        .find({
          activities: {
            $not: {
              $elemMatch: {
                count: { $gt: 0 },
              },
            },
          },
        })
        .toArray();

      // Remove days without activity
      const result = await days.deleteMany({
        _id: {
          $in: daysWithoutActivity.map((day) => day._id),
        },
      });

      return res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
