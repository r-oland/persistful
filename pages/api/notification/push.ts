import type { NextApiRequest, NextApiResponse } from 'next';
import { getDayAchievements } from 'utils/getDayAchievements';
import { getCollection } from 'utils/getMongo';
import { getNotificationMessage } from 'utils/getNotificationMessage';
import { publicVapidKey } from 'utils/notificationUtils';
import { setDateTime } from 'utils/setDateTime';
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
    const days = await getCollection<DayEntity>('days');
    const subscriptions = await collection.find().toArray();

    if (req.method === 'POST') {
      webpush.setVapidDetails(
        'mailto:info@rolandbranten.nl',
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );

      await Promise.all(
        subscriptions.map(async (subscription) => {
          const start = setDateTime(new Date(), 'start');
          const end = setDateTime(new Date(), 'end');

          const today = await days.findOne({
            userId: subscription.uid,
            createdAt: { $gte: start, $lt: end },
          });

          const currentStreak = getDayAchievements(today).streak;

          await triggerPushMsg(
            JSON.parse(subscription.data),
            JSON.stringify(getNotificationMessage(currentStreak))
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
