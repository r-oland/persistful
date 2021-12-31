import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await checkAuth(req, res);
    if (!session) return;

    const _id = new ObjectId(req.query.activityId as string);

    const activities = await getCollection<ActivityEntity>('activities');

    if (req.method === 'PUT') {
      const data = req.body;
      delete data.id;

      const result = await activities.findOneAndUpdate(
        { _id },
        { $set: data },
        { upsert: true }
      );

      res.status(200).send({ ...result.value, ...data });
    }

    if (req.method === 'DELETE') {
      // Change status to deleted so you can leter check if the name already exists to maintain history
      const result = await activities.findOneAndUpdate(
        { _id },
        { $set: { status: 'deleted' } }
      );

      res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
