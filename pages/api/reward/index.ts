import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { addImageToStorage } from 'utils/addImageToStorage';
import { checkAuth } from 'utils/checkAuth';
import { formDataParser } from 'utils/formDataParser';
import { getAchievedStreaks } from 'utils/getAchievedStreaks';
import { getCollection } from 'utils/getMongo';

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
          $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setUTCHours(23, 59, 59, 999)),
        },
      });

      const user = await users.findOne({ _id: objectUserId });
      const dailyStreak = getAchievedStreaks(today, user);
      //

      const data = await formDataParser(req);

      // FormData converts number to string -> convert back
      data.fields.totalCycles = parseInt(data.fields.totalCycles);

      // Handle uploading image
      const image = await addImageToStorage(data);

      // Add new reward entity
      const result = await rewards
        .insertOne({
          ...data.fields,
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
