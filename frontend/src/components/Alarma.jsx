import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

/**
 * Componente que gestiona las alarmas para la toma de medicamentos.
 * Muestra notificaciones cuando es momento de tomar el medicamento y permite registrar la toma.
 *
 * @returns {JSX.Element} Componente visual que muestra la notificación y el estado de la toma.
 */
const Alarma = () => {
  const [mensaje, setMensaje] = useState(null);
  const [permisoNotificacion, setPermisoNotificacion] = useState(Notification.permission);
  const [id_toma, setId_Toma] = useState(null);
  const [hora, setHora] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /**
   * Registra la toma de medicamento en el servidor.
   * 
   * @async
   * @function registrarToma
   * @returns {void}
   */
  const registrarToma = async () => {
    console.log(id_toma)
    try {
      const today = new Date().toLocaleDateString("fr-CA");
      const response = await fetch("http://localhost:8801/toma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_toma, fecha: today, hora }),
      });

      const data = await response.json();
      console.log("Datos recibidos:", data);

      if (response.ok) {
        setSuccess("Toma registrada correctamente.");
        setError("");
      } else {
        setError(data.error || "Error al registrar la toma.");
        setSuccess("");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.", err);
      setSuccess("");
    }
  };

  /**
   * Muestra una notificación de navegador al usuario.
   * 
   * @function mostrarNotificacion
   * @param {string} mensaje - El mensaje que se muestra en la notificación.
   * @returns {void}
   */
  const mostrarNotificacion = (mensaje) => {
    if (Notification.permission === "granted") {
      new Notification("¡Es momento de la medicación!", {
        body: mensaje,
        icon: logo,
      });
    } else {
      console.log("Permiso no concedido para notificaciones");
    }
  };

  /**
   * Solicita permiso al usuario para mostrar notificaciones.
   * Si el permiso es concedido, se actualiza el estado de permisoNotificacion.
   * 
   * @function solicitarPermisoNotificacion
   * @returns {void}
   */
  const solicitarPermisoNotificacion = () => {
    if (permisoNotificacion === "default") {
      Notification.requestPermission().then((result) => {
        setPermisoNotificacion(result);
      });
    }
  };

  /**
   * Hook que se ejecuta al cargar el componente. Solicita el permiso de notificaciones
   * y establece un intervalo para revisar las alarmas programadas.
   * 
   * @useEffect
   * @returns {void}
   */
  useEffect(() => {
    solicitarPermisoNotificacion();
    const interval = setInterval(() => {
      const ahora = new Date();
      const horaActual = ahora.toTimeString().slice(0, 5);

      const alarmasJSON = localStorage.getItem("alarmas");
      console.log("Revisando alarmas a las", horaActual);
      console.log("Revisando alarmas a las", alarmasJSON);
      if (alarmasJSON) {
        try {
          const alarmasData = JSON.parse(alarmasJSON);
          const alarmas = alarmasData.data;

          console.log("Revisando alarmas a las", alarmas);

          alarmas.forEach((alarma) => {
            if (alarma.hora.slice(0, 5) === horaActual) {
              const horaAlarma = alarma.hora.slice(0, 5);
              setHora(horaAlarma)
              const mensajeFinal = `Son las ${horaAlarma}, hora de tomar: ${alarma.nombre}`;
              setId_Toma(alarma.id_toma);
              console.log("idtoma", alarma.id_toma, horaAlarma, alarma.nombre);
              setMensaje(mensajeFinal);
              mostrarNotificacion(mensajeFinal);
            }
          });
        } catch (error) {
          console.error("Error al parsear las alarmas:", error);
        }
      }
    }, 50000); // cada 50 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {mensaje && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fffae6",
            padding: "1rem 2rem",
            borderRadius: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "1.2rem",
            zIndex: "100000000",
            marginBottom: "50px",
            textAlign: "center",
          }}
        >
          <p>{mensaje}</p>
          <button
            onClick={() => {
              registrarToma();
              setMensaje(null);
            }}
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Confirmar toma
          </button>
          <div>{success && <div style={{ color: "green" }}>{success}</div>}</div>
          <div>{error && <div style={{ color: "red" }}>{error}</div>}</div>
        </div>
      )}
    </>
  );
};

export default Alarma;
