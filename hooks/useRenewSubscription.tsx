// Components==============
import axios from 'axios';
import { add, isPast } from 'date-fns';
import { useEffect } from 'react';
import {
  fetchServiceWorker,
  subscribeUserToPush,
} from 'utils/notificationUtils';
// =========================

async function renewSubscription() {
  try {
    const lastRun = localStorage.getItem('last-renewed-subscription');
    const preventRenew = lastRun
      ? // Check if it's been more than 24 hours
        !isPast(add(new Date(Number(lastRun)), { hours: 24 }))
      : // Subscription has never been renewed
        false;

    // Don't do anything if it's been less than 24 hours
    if (preventRenew) return;

    const registration = await fetchServiceWorker();
    // Check for existing subscription
    const existingSubscription =
      await registration.pushManager.getSubscription();

    // Don't do anything if there wasn't a subscription
    if (!existingSubscription) return;

    // Unsubscribe from the existing subscription
    await existingSubscription.unsubscribe();

    // Remove subscription from database
    await axios.delete('/api/notification', {
      data: { subscription: existingSubscription },
    });

    // Create a new subscription
    const subscription = await subscribeUserToPush(registration);
    // Send the new subscription to your server
    await axios.post('/api/notification', { subscription });

    // Update the last renewed time
    localStorage.setItem(
      'last-renewed-subscription',
      String(new Date().getTime())
    );
  } catch (error) {
    console.error(error);
  }
}

export default function useRenewSubscription() {
  // Renews the subscription to prevent it from expiring
  useEffect(() => {
    renewSubscription();
  }, []);
}
