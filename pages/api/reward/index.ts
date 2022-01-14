import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';

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
      // // handle image
      // const db = await getMongo.then((r) => r.db());
      // const bucket = new GridFSBucket(db, { bucketName: 'bucky' });

      // fs.createReadStream('public/images/carrot.svg').pipe(
      //   bucket.openUploadStream('myFile', {
      //     chunkSizeBytes: 1048576,
      //     metadata: { field: 'myField', value: 'myValue' },
      //   })
      // );

      // bucket
      //   .openDownloadStreamByName('myFile')
      //   .pipe(fs.createWriteStream('./test.svg'));

      // Add new reward entity
      const result = await rewards
        .insertOne({
          ...req.body,
          userId,
          createdAt: new Date(),
        })
        .then(async (r) => {
          const users = await getCollection<UserEntity>('users');
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
