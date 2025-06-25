// service-worker.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title;
  const options = {
    body: data.body,
    icon: '/assets/logo.png', // Usa la ruta relativa desde la carpeta `public`
  };

  event.waitUntil(self.registration.showNotification(title, options));
});