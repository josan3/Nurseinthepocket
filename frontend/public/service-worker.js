self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title;
  const options = {
    body: data.body,
    icon: '/assets/logo.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});