import { StrictMode } from 'react';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import './firebase.js'

// Verifica si el navegador soporta Service Workers y luego registra el service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Registra el service worker cuando la página se haya cargado
    navigator.serviceWorker
      .register('/service-worker.js')  // Asegúrate de que el archivo 'service-worker.js' esté en la raíz
      .then((registration) => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch((error) => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}

// Renderizamos la app solo una vez
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
