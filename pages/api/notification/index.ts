import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAuth } from 'utils/checkAuth';
import { getCollection } from 'utils/getMongo';
import { publicVapidKey } from 'utils/notificationUtils';
import webpush from 'web-push';

const vapidKeys = {
  publicKey: publicVapidKey,
  privateKey: process.env.PRIVATE_VAPID_NOTIFICATION_KEY as string,
};

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
    // Check if session exists
    const session = await checkAuth(req, res);
    if (!session) return;

    // Get user id
    const _id = new ObjectId(session.user.uid);

    // get user
    const users = await getCollection<UserEntity>('users');
    const user = await users.findOne({ _id });

    // if user doesn't match session abort
    if (!user) return res.status(401).send('User not found');

    if (req.method === 'POST') {
      webpush.setVapidDetails(
        'mailto:info@rolandbranten.nl',
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );

      if (!user.subscription) return res.status(401).send('No subscription');

      const response = await triggerPushMsg(
        JSON.parse(user.subscription) as webpush.PushSubscription,
        JSON.stringify({
          title: 'Not to late to get started',
          message: 'A few hours left',
        })
      );

      return res.status(200).send(response);
    }
  } catch (err: any) {
    console.error(err);
    return res.status(500).send(err?.message || err);
  }
}
