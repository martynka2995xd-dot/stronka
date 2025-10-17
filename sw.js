// Service Worker dla aplikacji

self.addEventListener('install', event => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  event.waitUntil(clients.claim());
});

self.addEventListener('push', event => {
  console.log('Push notification received');
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Osoba kupująca czeka na zamówienie.',
    icon: 'logo.png',
    badge: 'logo.png'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Sprzedane!', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});