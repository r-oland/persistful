import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from 'utils/getDb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const test = await getDb('test');
    const result = await test?.find({}).toArray();

    return res.status(200).send(result);
  } catch (e) {
    return console.error(e);
  }
}
