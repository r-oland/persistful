import cron from 'node-cron';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const { CRON_API_KEY, NEXTAUTH_URL } = process.env;

cron.schedule('*/8 * * * * *', () => {
  fetch(`${NEXTAUTH_URL}/api/notification/push`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(CRON_API_KEY as string).toString('base64')}`,
    },
  }).catch((error: any) => {
    // Handle any errors that occur during the request
    console.error('error', error);
  });
});
