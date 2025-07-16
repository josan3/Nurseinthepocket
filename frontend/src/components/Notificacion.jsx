import { useEffect } from 'react';

const VAPID_PUBLIC_KEY = 'BJnmRk5I3UXVrXoAt0NuzlrvKII8Za9OtBWoSfAN1pDZxKmQYFJ1qCZf9Z32wsjOeC8rvHkx1QPILj21M4HVRew';

const Notificacion = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registrarServiceWorkerYSuscribirse();
    }
  }, []);

  const registrarServiceWorkerYSuscribirse = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', { type: 'module' });
      console.log('Service Worker registrado con éxito:', registration);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log('Suscripción exitosa:', subscription);

      await enviarSubscripcionAlServidor(subscription);
    } catch (error) {
      console.error('Error durante el proceso de notificación:', error);
    }
  };

  const enviarSubscripcionAlServidor = async (subscription) => {
    try {
      const response = await fetch('http://localhost:8801/subscripciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error al enviar la suscripción:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
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