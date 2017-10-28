self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification clicked');
    event.notification.close();
});
