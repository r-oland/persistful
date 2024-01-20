import type { NextApiRequest, NextApiResponse } from 'next';
import { getCollection } from 'utils/getMongo';
import { publicVapidKey } from 'utils/notificationUtils';
import webpush from 'web-push';

const vapidKeys = {
  publicKey: publicVapidKey,
  privateKey: process.env.PRIVATE_VAPID_NOTIFICATION_KEY as string,
};

const CRON_API_KEY = process.env.CRON_API_KEY as string;

async function triggerPushMsg(
  subscription: webpush.PushSubscription,
  dataToSend: string
) {
  try {
    return await webpush.sendNotification(subscription, dataToSend);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const encodedKey = (req.headers.authorization as string).slice(6); // Remove 'Basic ' prefix
    const decodedKey = Buffer.from(encodedKey, 'base64').toString('utf8');

    // check if authorization header matches CRON API KEY
    if (decodedKey !== CRON_API_KEY)
      return res.status(401).send('Not authorized');

    // Retrieve subscriptions from database
    const collection = await getCollection<SubscriptionEntity>('subscriptions');
    const subscriptions = await collection.find().toArray();

    if (req.method === 'POST') {
      webpush.setVapidDetails(
        'mailto:info@rolandbranten.nl',
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );

      await Promise.all(
        subscriptions.map(async (subscription) => {
          await triggerPushMsg(
            JSON.parse(subscription.data),
            JSON.stringify({
              title: 'Not too late to get started',
              message: 'A few hours left',
            })
          );
        })
      );

      return res.status(200).send({ message: 'cron job executed' });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
