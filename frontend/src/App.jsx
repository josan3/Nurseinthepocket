import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from "./assets/logo.png"; 

import InicioSesion from "./components/InicioSesion";
import Registro from './components/Registro';
import Bienvenida from './components/Bienvenida';
import BienvenidaGoogle from './components/BienvenidaGoogle';
import Datos from './components/Datos';
import Peso from './components/Peso';
import Frecuencia from './components/Frecuencia';
import Tension from './components/Tension';
import Arritmia from './components/Arritmia';
import Inicio from './components/Inicio';
import Configuracion from './components/Configuracion';
import Correo from './components/Correo';
import Informacion from './components/Informacion';
import Administracion from './components/Administracion';
import Medicacion from './components/Medicacion';
import NotFound from './components/NotFound';
import Alarma from "./components/Alarma";
import Notificacion from "./components/Notificacion";
import Tomas from "./components/Tomas";
import CuerpoMedico from "./components/CuerpoMedico";

function App() {
  const [message, setMessage] = useState('');

  const PUBLIC_VAPID_KEY = "BJnmRk5I3UXVrXoAt0NuzlrvKII8Za9OtBWoSfAN1pDZxKmQYFJ1qCZf9Z32wsjOeC8rvHkx1QPILj21M4HVRew";

  const suscribirsePush = async () => {
    try {
      // Verifica si el navegador soporta Service Workers
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        console.log('Service Worker registrado con éxito:', registration);
  
        // Realiza la suscripción
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        });
  
        // Ahora la variable 'subscription' está definida
        console.log('Suscripción exitosa:', subscription);
  
        // Envía la suscripción al backend
        await fetch('http://localhost:8801/subscripciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(subscription)
        });
      }
    } catch (error) {
      console.error('Error al suscribirse:', error);
    }
  };
  

  // Utilidad para convertir la clave VAPID
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registrado con éxito:", registration);
        })
        .catch((error) => {
          console.error("Error al registrar el Service Worker:", error);
        });
    }
    suscribirsePush();
  }, []);


  return (
    <div className='area'>
      <h1>
        <h2>
          <div class="movimiento" style={{fontfamily: 'Garamond'}}>
          NURSE&nbsp;&nbsp;
            <img src={logo} alt="Robot" className="robot" style={{minWidth: "30px" ,width: "3%", height: "auto" }} />
          </div>
          
          <div class="span">
            in the pocket
          </div>
        </h2>
      </h1>

    <Notificacion/>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <InicioSesion setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Registro setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path="/welcome"
            element={
              <>
                <Bienvenida setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path="/bienvenida"
            element={
              <>
                <BienvenidaGoogle setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/data"
            element={
              <>
                <Datos setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/peso"
            element={
              <>
                <Alarma/>
                <Peso setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/frecuencia"
            element={
              <>
                <Alarma/>
                <Frecuencia setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/tension"
            element={
              <>
                <Alarma/>
                <Tension setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/arritmia"
            element={
              <>
                <Alarma/>
                <Arritmia setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/home"
            element={
              <>
                <Alarma/>
                <Inicio setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/configuracion"
            element={
              <>
                <Alarma/>
                <Configuracion setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/correo"
            element={
              <>
                <Alarma/>
                <Correo setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/informacion"
            element={
              <>
                <Alarma/>
                <Informacion setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/administracion"
            element={
              <>
                <Alarma/>
                <Administracion setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/404"
            element={
              <>
                <Alarma/>
                <NotFound setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/medicacion"
            element={
              <>
                <Alarma/>
                <Medicacion setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/tomas"
            element={
              <>
                <Alarma/>
                <Tomas setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
          <Route
            path = "/cuerpomedico"
            element={
              <>
                <Alarma/>
                <CuerpoMedico setMessage={setMessage} />
                {message && <p>{message}</p>}
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
