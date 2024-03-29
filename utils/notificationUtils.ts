export function checkNotificationBrowserSupport() {
  if (!('serviceWorker' in navigator)) return false;
  if (!('Notification' in window)) return false;
  if (!('PushManager' in window)) return false;

  return true;
}

export async function getNotificationPermission() {
  try {
    await Notification.requestPermission();
  } catch (err) {
    throw new Error(`Unable to get permission to notify. ${err}`);
  }
}

export async function fetchServiceWorker() {
  try {
    // Check if worker is already registered
    const registeredServiceWorker = await navigator.serviceWorker.ready;
    if (registeredServiceWorker) return registeredServiceWorker;

    // worker is not registered, register it
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch (err) {
    throw new Error(`Unable to register service worker. ${err}`);
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    // eslint-disable-next-line no-useless-escape
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const publicVapidKey =
  'BMja34lTqCxE9hK23uCLg7PxphtXFZFWB5IWrzmO9YWDAricQzaqryLNzJ6WOoaklveP4b9EtMEelfv0mEVo4qc';

export async function subscribeUserToPush(
  registration: ServiceWorkerRegistration
) {
  try {
    const pushSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    return JSON.stringify(pushSubscription);
  } catch (err) {
    throw new Error(`Unable to subscribe to push. ${err}`);
  }
}
