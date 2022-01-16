import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';
import { promises as fs } from 'fs';
import { addImageToStorage } from 'utils/addImageToStorage';
import { formDataParser } from 'utils/formDataParser';

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
    await checkAuth(req, res);

    const _id = new ObjectId(req.query.rewardId as string);

    const rewards = await getCollection<RewardEntity>('rewards');

    // update reward
    if (req.method === 'PUT') {
      const data = await formDataParser(req);
      delete data.fields.id;

      // FormData converts number to string -> convert back
      if (data.fields.totalCycles)
        data.fields.totalCycles = parseInt(data.fields.totalCycles);

      let image;

      if (data.files?.image) {
        // Handle uploading image
        const newImage = await addImageToStorage(data);
        image = newImage;

        // remove old image
        const reward = await rewards.findOne<RewardEntity>({ _id });
        await fs.unlink(`public${reward?.image}`);
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
      const result = await rewards.findOneAndDelete({ _id }).then((r) => {
        // remove old image
        fs.unlink(`public${r.value?.image}`);
      });

      res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
