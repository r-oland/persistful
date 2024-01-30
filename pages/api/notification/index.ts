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

    // get subscriptions
    const collection =
      await getCollection<Omit<SubscriptionEntity, '_id'>>('subscriptions');

    if (req.method === 'POST') {
      // add new subscription
      const result = await collection.insertOne({
        uid: session.user.uid,
        data: req.body.subscription,
        createdAt: new Date(),
      });

      return res.status(200).send(result);
    }

    if (req.method === 'DELETE') {
      // delete subscription
      const result = await collection.findOneAndDelete({
        uid: session.user.uid,
        data: JSON.stringify(req.body.subscription),
      });

      return res.status(200).send(result);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
