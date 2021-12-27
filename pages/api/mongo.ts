import type { NextApiRequest, NextApiResponse } from 'next';
import { getCollection } from 'utils/getMongo';
import { checkAuth } from '../../utils/checkAuth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await checkAuth(req, res);

    const test = await getCollection('test');
    const result = await test?.find({}).toArray();

    return res.status(200).send(result);
  } catch (e) {
    return console.error(e);
  }
}
