import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await checkAuth(req, res);

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
      const result = await activities.deleteOne({ _id });

      res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
