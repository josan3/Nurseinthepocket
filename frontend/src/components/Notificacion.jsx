import { useEffect } from 'react';

const VAPID_PUBLIC_KEY = 'BJnmRk5I3UXVrXoAt0NuzlrvKII8Za9OtBWoSfAN1pDZxKmQYFJ1qCZf9Z32wsjOeC8rvHkx1QPILj21M4HVRew';

const Notificacion = () => {

  useEffect(() => {
    // Verifica si el navegador soporta Service Workers y Push Notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js', { type: 'module' })
        .then((registration) => {
          console.log('Service Worker registrado con éxito:', registration);

          // Suscribir al usuario para recibir notificaciones
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          }).then((subscription) => {
            console.log('Suscripción exitosa:', subscription);
            
            // Enviar la suscripción al servidor
            fetch('http://localhost:8801/subscripciones', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(subscription),
            })
              .then((response) => response.json())
              .then((data) => console.log(data))
              .catch((error) => console.error('Error al enviar la suscripción:', error));
          });
        })
        .catch((error) => {
          console.log('Error al registrar el Service Worker:', error);
        });
    }
  }, []);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return <div>Registrando suscripción...</div>;
};

export default Notificacion;
