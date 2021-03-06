import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { addImageToStorage } from 'utils/addImageToStorage';
import { checkAuth } from 'utils/checkAuth';
import { formDataParser } from 'utils/formDataParser';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getCollection } from 'utils/getMongo';
import { setDateTime } from 'utils/setDateTime';

// disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if session exists
    const session = await checkAuth(req, res);
    if (!session) return;

    // get rewards
    const rewards = await getCollection<RewardEntity>('rewards');

    // Get user id
    const userId = session.user.uid;
    const objectUserId = new ObjectId(userId);

    if (req.method === 'GET') {
      const data = await rewards.find({ userId }).toArray();

      // fetch rewards
      return res.status(200).send(data);
    }

    if (req.method === 'POST') {
      // get daily streak to set startCycles
      const users = await getCollection<UserEntity>('users');
      const days = await getCollection<DayEntity>('days');

      const today = await days.findOne({
        userId,
        createdAt: {
          $gte: setDateTime(new Date(), 'start'),
          $lt: setDateTime(new Date(), 'end'),
        },
      });

      const dailyStreak = getDayAchievements(today).streak;
      //

      const data = await formDataParser(req);

      // FormData converts number to string -> convert back
      (data.fields.totalCycles as string | number) = parseInt(
        data.fields.totalCycles as string
      );

      // Handle uploading image
      const image = await addImageToStorage(data, `rewards/${userId}`);

      // Add new reward entity
      const result = await rewards
        .insertOne({
          ...(data.fields as any),
          image,
          userId,
          createdAt: new Date(),
          startCycles: dailyStreak,
          completedCycles: 0,
        })
        .then(async (r) => {
          await users.findOneAndUpdate(
            { _id: objectUserId },
            { $set: { activeReward: r.insertedId } },
            { upsert: true }
          );
        });

      return res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
