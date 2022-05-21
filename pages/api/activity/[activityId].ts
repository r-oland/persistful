import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';
import { setDateTime } from 'utils/setDateTime';

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
      const data = req.body as Partial<ActivityEntity> & { id?: number };
      delete data.id;

      const result = await activities.findOneAndUpdate(
        { _id },
        { $set: data },
        { upsert: true }
      );

      // Also update changes in today's day entity
      if (data?.penalty !== undefined || data?.countMode || data?.countCalc) {
        const days = await getCollection<DayEntity>('days');
        const start = setDateTime(new Date(), 'start');
        const end = setDateTime(new Date(), 'end');

        const today = await days.findOne({
          userId: session.user.uid,
          createdAt: { $gte: start, $lt: end },
        });

        await days.findOneAndUpdate(
          {
            userId: session.user.uid,
            createdAt: { $gte: start, $lt: end },
          },
          {
            $set: {
              activities: today?.activities.map((a) =>
                // @ts-ignore
                a?._id.equals(result.value?._id)
                  ? {
                      ...a,
                      penalty:
                        data?.penalty !== undefined ? data.penalty : a.penalty,
                      countMode: data?.countMode || a.countMode,
                      countCalc: data?.countCalc || a.countCalc,
                      count: data?.count || a.count,
                    }
                  : a
              ),
            },
          }
        );
      }

      res.status(200).send({ ...result.value, ...data });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
