import { UpdateActivityCountTypes } from 'actions/day/useUpdateActivityCount';
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

    if (req.method === 'PUT') {
      const data = req.body as UpdateActivityCountTypes;

      // get day
      const days = await getCollection<DayEntity>('days');
      const _id = new ObjectId(data.id) as any;
      const day = await days.findOne({ _id });
      if (!day) return res.status(404).send({ message: 'day not found' });

      // get activity
      const activities = await getCollection<ActivityEntity>('activities');
      const activityId = new ObjectId(data.activityId) as any;
      const activity = await activities.findOne({ _id: activityId });
      if (!activity)
        return res.status(404).send({ message: 'activity not found' });

      // set new count value to activity entity
      await activities.updateOne(
        { _id: activityId },
        { $set: { count: activity.count + data.value } }
      );

      // calculate new activities array
      const newValue = day.activities.map((a) =>
        // @ts-ignore
        a._id.equals(data.activityId)
          ? { ...a, count: a.count + data.value }
          : a
      );

      // set new count value to day entity
      const result = await days.findOneAndUpdate(
        { _id },
        { $set: { activities: newValue } },
        { upsert: true }
      );

      res.status(200).send({ ...result.value, ...data });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
