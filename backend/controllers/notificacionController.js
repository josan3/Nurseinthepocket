import webPush from 'web-push';
import { getAlarmas } from "./pacienteController"; 

const suscripciones = []; // Array con las suscripciones de los usuarios

/**
 * Envía una notificación push al usuario.
 * 
 * @param {string} userId - El ID del usuario al que se le enviará la notificación.
 * @param {string} titulo - El título de la notificación.
 * @param {string} mensaje - El mensaje de la notificación.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición El parámetro `userId` debe existir y ser válido. El `titulo` y el `mensaje` deben ser cadenas no vacías.
 * @postcondición Si se encuentra la suscripción del usuario, se envía la notificación push con el título y el mensaje. Si ocurre un error, se maneja e imprime en consola.
 */

const enviarNotificacionPush = async (userId, titulo, mensaje) => {
  const payload = JSON.stringify({ title: titulo, body: mensaje });

  // Asegúrate de que 'suscripciones' esté definido y no vacío antes de buscar
  if (!Array.isArray(suscripciones) || suscripciones.length === 0) {
    console.warn("No hay suscripciones disponibles para enviar notificación");
    return;
  }

  // Filtrar la suscripción para el usuario específico
  const suscripcion = suscripciones.find((sub) => sub.userId === userId);

  if (suscripcion) {
    try {
      await webPush.sendNotification(suscripcion.subscription, payload);
      console.log('Notificación enviada');
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
    }
  } else {
    console.warn(`No se encontró suscripción para el usuario con ID ${userId}`);
  }
};


/**
 * Verifica las alarmas del usuario y envía una notificación push si la hora actual coincide con alguna de las alarmas.
 * 
 * @param {string} userId - El ID del usuario para el que se deben verificar las alarmas.
 * @param {string} alarmasobtenidas - Un string JSON que contiene un array de alarmas.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición El parámetro `userId` debe existir y ser válido. `alarmasobtenidas` debe ser una cadena JSON válida con un array de alarmas.
 * @postcondición Si la hora actual coincide con alguna de las alarmas, se envía una notificación push al usuario con la medicación correspondiente. Si ocurre un error, se maneja adecuadamente.
 */
const verificarYEnviarNotificaciones = async (userId, alarmasobtenidas) => {
  const horaActual = new Date().toISOString().slice(11, 16); 

  if (alarmasobtenidas) {
    try {
      const alarmasData = JSON.parse(alarmasobtenidas);
      const alarmas = alarmasData.data;

      alarmas.forEach((alarma) => {
        const horaAlarma = alarma.hora.slice(0, 5);

        if (horaAlarma === horaActual) {
          enviarNotificacionPush(userId, '¡Es hora de la medicación!', `Recuerda tomar tu ${alarma.nombre_medicamento}`);
        }
      });
    } catch (error) {
      console.error("Error al parsear las alarmas:", error);
    }
  }
};

/**
 * Maneja la solicitud para verificar y enviar notificaciones de alarmas al usuario.
 * 
 * @param {Object} req - El objeto de solicitud que contiene los parámetros del usuario.
 * @param {Object} res - El objeto de respuesta para enviar el resultado al cliente.
 * 
 * @returns {void} - No retorna ningún valor, pero responde con un código HTTP.
 * 
 * @precondición La solicitud debe contener un parámetro `id` válido en `req.body` para obtener las alarmas del usuario.
 * @postcondición Si las alarmas se obtienen correctamente, se verifican y envían las notificaciones. Si ocurre un error, se responde con un código 400 o 500 según el caso.
 */
const notificacion = async (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  const { id } = req.body;

  try {
    const result = await getAlarmas(id);

    if (!result || !result.data) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    const alarmasobtenidas = result.data; 
    await verificarYEnviarNotificaciones(id, alarmasobtenidas);

    return res.status(200).json({ message: 'Notificación procesada correctamente' });
  } catch (err) {
    return res.status(500).json({ error: 'Error al procesar la solicitud', err });
  }
};



module.exports = { notificacion };
