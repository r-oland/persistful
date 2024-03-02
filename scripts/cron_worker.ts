import cron from 'node-cron';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const { CRON_API_KEY, NEXTAUTH_URL } = process.env;

// Every day at 21:30
cron.schedule('30 21 * * *', () => {
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

// Every day at 03:00
cron.schedule('0 3 * * *', () => {
  fetch(`${NEXTAUTH_URL}/api/cleanup`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(CRON_API_KEY as string).toString('base64')}`,
    },
  }).catch((error: any) => {
    // Handle any errors that occur during the request
    console.error('error', error);
  });
});
