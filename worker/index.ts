/// <reference lib="webworker" />
export default null;
declare let self: ServiceWorkerGlobalScope;

// Send a push notification to the user when server receiving a push message from the server
self.addEventListener('push', (event) => {
  if (!event.data) return console.log('This push event has no data.');

  const { title, message } = event.data.json() as {
    title: string;
    message: string;
  };

  event.waitUntil(
    self.registration.showNotification(title, {
      body: message,
      icon: '/logo/android-chrome-192x192.png',
    })
  );
});

// Open the app when the notification is clicked
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event?.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          let client = clientList[0];
          for (let i = 0; i < clientList.length; i++) {
            if (clientList[i].focused) {
              client = clientList[i];
            }
          }
          return client.focus();
        }
        return self.clients.openWindow('/');
      })
  );
});
