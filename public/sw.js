self.addEventListener('install', () => {
  console.info('service worker installed.');
});

const sendDeliveryReportAction = () => {
  console.log('Web push delivered.');
};

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  event.waitUntil(clients.openWindow('https://delightful-flower-043e6d600.4.azurestaticapps.net/'))
})

self.addEventListener('push', function (event) {
 /*

if (event.data) {
  const data = event.data.json() // Payload from the server, assumed to be in JSON format

  event.waitUntil(
    // Upon receiving the push event, call **Notifications API** to push the notification
    self.registration.showNotification(
      data.title ? data.title : "New Message",
      {
        body: data.body,
        badge: "images/badge_icon.png",
        vibrate: [200, 100, 200],
        timestamp: Date.now(),
        data: { use_to_open_specific_page: data.props }, // Custom data sent from the server
      }
    )
  )
    
*/
  if (!event.data) {
    return;
  }



//let sound = new Audio();
//sound.src = '../public/sound/bell.mp3';
//sound.load();
//sound.play();

  const payload = event.data.json();
  const { body, icon, image, badge, url, title } = payload;
  const notificationTitle = title ?? 'Task Tempo';
  const notificationOptions = {
    body, 
    icon,//icon: data.icon || '/logo512.png',
    image,
    vibrate: [100, 50, 100],
    data: {
      url,
    },
    badge//: '/logo192.png',
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions).then(() => {
      sendDeliveryReportAction();
    }),
  );
});
