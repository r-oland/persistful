import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';
import { promises as fs } from 'fs';
import { addImageToStorage } from 'utils/addImageToStorage';
import { formDataParser } from 'utils/formDataParser';
import { bucket } from 'utils/getBucket';

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
    const session = await checkAuth(req, res);
    if (!session) return res.status(404).send({ message: 'Session not found' });

    const _id = new ObjectId(req.query.rewardId as string) as any;
    const userId = session.user.uid;

    const rewards = await getCollection<RewardEntity>('rewards');

    // update reward
    if (req.method === 'PUT') {
      const data = await formDataParser(req);
      const setToActive = data.fields.setToActive === 'true';

      delete data.fields.id;
      delete data.fields.setToActive;

      // FormData converts number to string -> convert back
      if (data.fields.totalCycles)
        (data.fields.totalCycles as string | number) = parseInt(
          data.fields.totalCycles as string
        );

      if (data.fields.minCycles)
        (data.fields.minCycles as string | number) = parseInt(
          data.fields.minCycles as string
        );

      let image;

      if (data.files?.image) {
        // Handle uploading image
        const newImage = await addImageToStorage(data, `rewards/${userId}`);
        image = newImage;

        // remove old image
        const reward = await rewards.findOne<RewardEntity>({ _id });
        const file = reward?.image.replace(
          `https://storage.googleapis.com/${process.env.GOOGLE_BUCKET_NAME}/`,
          ''
        );
        if (file) bucket.file(file).delete();
      }

      if (setToActive) {
        const users = await getCollection<UserEntity>('users');

        await users.findOneAndUpdate(
          { _id: new ObjectId(userId) as any },
          { $set: { activeReward: _id } }
        );
      }

      const result = await rewards.findOneAndUpdate(
        { _id },
        { $set: image ? { ...data.fields, image } : { ...data.fields } },
        { upsert: true }
      );

      res.status(200).send({ ...result.value, ...data.fields });
    }

    // delete reward
    if (req.method === 'DELETE') {
      const result = await rewards
        .findOneAndDelete({ _id })
        // remove old image
        .then((r) => {
          fs.unlink(`public${r.value?.image}`);
        })
        // Remove activeReward from user object
        .then(async () => {
          const users = await getCollection<UserEntity>('users');

          const openRewards = await rewards
            .find({
              userId,
              // no endDate means it's still open
              endDate: { $exists: false },
            })
            .sort({ createdAt: -1 })
            .toArray();

          await users.findOneAndUpdate(
            { _id: new ObjectId(userId) as any },
            // Set first open reward as active reward if it exists, if it doesn't -> undefined
            { $set: { activeReward: openRewards?.[0]?._id } }
          );
        });

      res.status(200).send(result);
    }

    if (req.method === 'GET') {
      const result = await rewards.findOne({ _id });

      res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
