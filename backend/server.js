const express = require('express');
const cors = require('cors');
const webPush = require('web-push');
const cron = require('node-cron');

const inicioSesionRouter = require('./routes/inicioSesion');
const inicioSesionGoogleRouter = require('./routes/inicioSesiongoogle');
const registroRouter = require('./routes/registro');
const registroRouterGoogle = require('./routes/registrogoogle.js');
const datosRouter = require('./routes/datos');
const datosRouterGoogle = require('./routes/datosGoogle');
const getPesoRouter = require('./routes/getpeso');
const pesoRouter = require('./routes/peso');
const frecuenciaRouter = require('./routes/frecuencia');
const getFrecuenciaRouter = require('./routes/getFrecuencia');
const tensionRouter = require('./routes/tension');
const getTensionRouter = require('./routes/getTension');
const arritmiaRouter = require('./routes/arritmia');
const getArritmiaRouter = require('./routes/getarritmia');
const configuracionRouter = require('./routes/configuracion');
const getConfiguracionRouter = require('./routes/getconfiguracion');
const getNombreRouter = require('./routes/getnombre');
const enviarCorreoRouter = require('./routes/enviarcorreo');
const getPacienteRouter = require('./routes/getpaciente');
const getUsuariosRouter = require('./routes/getUsuarios.js');
const getMedicamentosRouter = require('./routes/getmedicamentos');
const getAlarmaRouter = require('./routes/getAlarmas.js');
const setMedicamentosRouter = require('./routes/setmedicamentos');
const eliminarMedicamentosRouter = require('./routes/eliminarMedicamentos');
const sesionRouter = require('./routes/sesion');
const setpacientemedicamentoRouter = require('./routes/setpacientemedicamento.js');
const eliminarArritmiaRouter = require('./routes/eliminarArritmia.js');
const setTomaRouter = require('./routes/setToma.js');
const getTomaRouter = require('./routes/getTomas.js');
const eliminarTomasRouter = require('./routes/eliminarTomas.js');
const getListaTomaRouter = require('./routes/getListaToma.js');
const setTomaaPacienteRouter = require('./routes/setTomaaPaciente.js');
const actualizarUsuarioRouter = require('./routes/actualizarusuario.js');
const setUsuarioRouter = require('./routes/setUsuario.js');
const eliminarRouter = require('./routes/eliminarusuario.js');
const editarUsuarioRouter = require('./routes/editarusuario.js');
const getCorreoRouter = require('./routes/getCorreo.js');
const getUsuariosCentroRouter = require('./routes/getusuariocentro.js');
const eliminarTomaRouter = require('./routes/eliminarmedicamentopaciente.js');
const registrousuarioRouter = require('./routes/registrousuario.js');
const historialRouter = require('./routes/historial.js');

const app = express();
app.use(express.json());  // Middleware para manejar JSON
app.use(cors({ origin: "*" }));          // Middleware para permitir peticiones desde el frontend


// Configurar claves VAPID
const vapidKeys = {
  publicKey: "BJnmRk5I3UXVrXoAt0NuzlrvKII8Za9OtBWoSfAN1pDZxKmQYFJ1qCZf9Z32wsjOeC8rvHkx1QPILj21M4HVRew",
  privateKey: "jliJTq9nnJHfyd1su81W68Im58YWZZ1nYIyAbe2Hh5I",
};

webPush.setVapidDetails(
  "mailto:nurseinthepocket@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Guardar suscripción
let suscripciones = [];

app.post('/subscripciones', (req, res) => {
  const subscripcion = req.body;
  suscripciones.push(subscripcion);
  res.status(201).json({ message: 'Suscripción guardada con éxito' });
});

// Enviar notificación
app.post('/notificar', async (req, res) => {
  const { title, body } = req.body;

  const payload = JSON.stringify({ title, body });

  try {
    const resultados = await Promise.allSettled(
      suscripciones.map((sub) => webPush.sendNotification(sub, payload))
    );
    res.json({ message: 'Notificaciones enviadas', resultados });
  } catch (err) {
    console.error("Error al enviar notificaciones:", err);
    res.status(500).json({ error: "Fallo al enviar notificaciones" });
  }
});

// Función para enviar la notificación push
const enviarNotificacionPush = async (titulo, mensaje) => {
  const payload = JSON.stringify({ title: titulo, body: mensaje });

  try {
    const resultados = await Promise.allSettled(
      suscripciones.map((sub) => webPush.sendNotification(sub, payload))
    );
    console.log('Notificaciones enviadas:', resultados);
  } catch (error) {
    console.error("Error al enviar notificaciones:", error);
  }
};


// Usar el archivo de rutas para las distintas funciones
app.use('/login', inicioSesionRouter);
app.use('/logingoogle', inicioSesionGoogleRouter);
app.use('/register', registroRouter);
app.use('/registergoogle', registroRouterGoogle);
app.use('/data', datosRouter);
app.use('/dataGoogle', datosRouterGoogle);
app.use('/getpeso', getPesoRouter);
app.use('/peso', pesoRouter);
app.use('/frecuencia', frecuenciaRouter);
app.use('/getfrecuencia', getFrecuenciaRouter);
app.use('/tension', tensionRouter);
app.use('/gettension', getTensionRouter);
app.use('/arritmia', arritmiaRouter);
app.use('/getarritmia', getArritmiaRouter);
app.use('/configuracion', configuracionRouter);
app.use('/getconfiguracion', getConfiguracionRouter);
app.use('/getnombre', getNombreRouter);
app.use('/enviarcorreo', enviarCorreoRouter);
app.use('/getpaciente', getPacienteRouter);
app.use('/getusernames', getUsuariosRouter);
app.use('/getusuarioscentro', getUsuariosCentroRouter);
app.use('/getmedicamentos', getMedicamentosRouter);
app.use('/setmedicamentos', setMedicamentosRouter);
app.use('/deletemedicamentos', eliminarMedicamentosRouter);
app.use('/sesion', sesionRouter);
app.use('/setpacientemedicamento', setpacientemedicamentoRouter);
app.use('/getalarmas', getAlarmaRouter);
app.use('/eliminararritmia', eliminarArritmiaRouter);
app.use('/toma', setTomaRouter);
app.use('/gettomas', getTomaRouter);
app.use('/eliminartoma', eliminarTomasRouter);
app.use('/getlistatoma', getListaTomaRouter);
app.use('/settomaapaciente', setTomaaPacienteRouter);
app.use('/actualizarusuario', actualizarUsuarioRouter);
app.use('/setusuario', setUsuarioRouter);
app.use('/eliminar', eliminarRouter);
app.use('/editarusuario', editarUsuarioRouter);
app.use('/getcorreo', getCorreoRouter);
app.use('/getusuariocentro', getUsuariosCentroRouter);
app.use('/deletetoma', eliminarTomaRouter);
app.use('/registrousuario', registrousuarioRouter);
app.use("/gethistorial", historialRouter);

app.get('/', (req, res)=> {
    return res.json("From Backend Side");
});

// Puerto del servidor
app.listen(8801, '0.0.0.0', () => {
  console.log('Servidor backend corriendo en http://localhost:8801');
});
