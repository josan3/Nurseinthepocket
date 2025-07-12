const { application } = require('express');
const {obtenerHistorial, setRegistroUsuarioAcceso, crearUsuario, crearUsuarioGoogle, encontrarUsuarioporCorreo, getCorreo, actualizar, actualizarGoogle, getUsuarioporId, actualizarUsuarioporId, getNombreUsuarioporId, getListaUsuarios, editarUsuarioporId, eliminarUsuarioporId, getListaUsuariosCentro} = require('../models/usuarioModel');
const bcrypt = require ('bcryptjs');
const {getDatosPacienteporId, setPacienteporId } = require('../models/pacientesModel');
const util = require("util");
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const saltRounds = 10;

/**
 * Registra un nuevo usuario en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición {req.body} Debe contener `correo`, `nombre`, `password`, `apellido1`, `apellido2` con datos válidos.
 * @postcondición Si los datos son válidos, se crea un nuevo usuario y se retorna un mensaje de éxito. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const registroUsuario = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado o malformado' });
    }

    const idToken = authHeader.split(' ')[1];

    // Verifica el token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const correo = decodedToken.email;

    if (!correo) {
      return res.status(400).json({ error: "No se pudo extraer el correo del token" });
    }

    const { nombre, password, apellido1, apellido2, centro } = req.body;

    if (!nombre || !password || !apellido1 || !centro) {
      return res.status(400).json({ error: "Aporta todos los datos para crear el usuario" });
    }

      crearUsuario(correo, nombre, password, apellido1, apellido2, centro, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error al acceder a la base de datos', err });
        }
        if (!result) {
          return res.status(400).json({ error: 'Error al crear el usuario' });
        }

        return res.status(201).json({
          message: 'Usuario creado con éxito',
          result: result
        });
    });

  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};




/**
 * Registra un nuevo usuario en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición {req.body} Debe contener `correo` con datos válidos.
 * @postcondición Si los datos son válidos, se crea un nuevo usuario y se retorna un mensaje de éxito. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const registroUsuarioGoogle = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado o malformado' });
    }

    const idToken = authHeader.split(' ')[1];

    // Verifica el token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const correo = decodedToken.email;

    if (!correo) {
      return res.status(400).json({ error: "No se pudo extraer el correo del token" });
    }

    // Crear usuario en la base de datos
    crearUsuarioGoogle(correo, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al acceder a la base de datos' });
      }
      if (!result) {
        return res.status(400).json({ error: 'Error al crear el usuario' });
      }

      return res.status(201).json({
        message: 'Usuario creado con éxito',
        result: result
      });
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

/**
 * Actualiza los datos de un usuario en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición {req.body} Debe contener `id`, `altura`, `genero`, `habitos_toxicos`, `fecha_nacimiento` con datos válidos.
 * @postcondición Si los datos son válidos, se actualizan los datos del usuario en la base de datos y se retorna un mensaje de éxito. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const actualizarUsuario = (req, res) => {
  const { id, altura, genero, habitos_toxicos, fecha_nacimiento } = req.body;

  console.log("id, ",id, altura, genero, habitos_toxicos, fecha_nacimiento);

  if (!altura || !genero || !habitos_toxicos || !fecha_nacimiento) {
    return res.status(400).json({ error: "Aporta todos los datos para actualizar el usuario (si no tiene hábitos tóxicos indique nada)" });
  }
  if (!id){
    return res.status(400).json({ error: "Problemas encontrando el usuario" });
  }

  actualizar(id, altura, genero, habitos_toxicos, fecha_nacimiento, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al actualizar el usuario' });
    }

    return res.status(201).json({
      message: 'Usuario actualizado con éxito',
    });
  });
};

/**
 * Actualiza los datos de un usuario en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición {req.body} Debe contener `id`, `nombre`,`apellido1`, `apellido2`, `centro` `altura`, `genero`, `habitos_toxicos`, `fecha_nacimiento` con datos válidos.
 * @postcondición Si los datos son válidos, se actualizan los datos del usuario en la base de datos y se retorna un mensaje de éxito. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const actualizarUsuarioGoogle = (req, res) => {
  const { id, nombre, apellido1, apellido2, centro, altura, genero, habitos_toxicos, fecha_nacimiento } = req.body;

  if (!nombre || !apellido1 || !apellido2 || !centro || !altura || !genero || !habitos_toxicos || !fecha_nacimiento) {
    return res.status(400).json({ error: "Aporta todos los datos para actualizar el usuario (si no tiene hábitos tóxicos indique nada)" });
  }
  if (!id){
    return res.status(400).json({ error: "Problemas encontrando el usuario" });
  }

  actualizarGoogle( id, nombre, apellido1, apellido2, centro, altura, genero, habitos_toxicos, fecha_nacimiento, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al actualizar el usuario' });
    }

    return res.status(201).json({
      message: 'Usuario actualizado con éxito',
    });
  });
};

/**
 * Realiza el inicio de sesión de un usuario.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición {req.body} Debe contener `id` y `password` con datos válidos.
 * @postcondición Si los datos son válidos, se realiza el inicio de sesión y se retorna un mensaje de éxito. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const inicioSesionUsuario = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado o malformado' });
    }

    const idToken = authHeader.split(' ')[1];

    // Verificamos el token con Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const correo = decodedToken.email;

    // Ahora buscamos el usuario en tu base de datos por correo
    encontrarUsuarioporCorreo(correo, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Error al consultar la base de datos' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }

      // El token es válido y el usuario existe en tu base de datos
      return res.json({ result: user });
    });
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};


/**
 * Realiza el inicio de sesión de un usuario.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición {req.body} Debe contener `correo` con datos válidos.
 * @postcondición Si los datos son válidos, se realiza el inicio de sesión y se retorna un mensaje de éxito. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const inicioSesionUsuarioGoogle = async (req, res) => {
  try {
    // Verificar header de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado o malformado' });
    }

    const idToken = authHeader.split(' ')[1];

    // Verificar token con Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const correo = decodedToken.email;

    // Buscar en tu base de datos
    encontrarUsuarioporCorreo(correo, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Error al consultar la base de datos' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }

      console.log("Usuario autenticado y encontrado:", correo);
      return res.json({ result: user });
    });
  } catch (error) {
    console.error('Error al verificar el token de Firebase:', error);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

/**
 * Actualiza los datos del usuario y paciente en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición {req.body} Debe contener los datos a actualizar del usuario y paciente.
 * @postcondición Si los datos son válidos, se actualizan el usuario y paciente en la base de datos y se retorna un mensaje de éxito. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const setUsuario = (req, res) => {
  const { id, nombre, password, apellido1, apellido2, altura, habitos_toxicos, correo, centro } = req.body;

  if (!nombre && !password && !apellido1 && !apellido2 && !altura && !habitos_toxicos && !correo && !centro) {
    return res.status(400).json({ error: "Aporta todos los datos para editar el usuario" });
  }

  actualizarUsuarioporId(id, nombre, apellido1, apellido2, correo, centro, (err1, result1) => {
    if (err1) {
      return res.status(500).json({ error: "Error al editar el usuario" });
    }

    setPacienteporId(id, altura, habitos_toxicos, (err2, result2) => {
      if (err2) {
        return res.status(500).json({ error: "Error al editar el paciente" });
      }

      return res.status(201).json({
        message: "Usuario actualizado y paciente actualizado con éxito",
        // uid: userRecord.uid,  <-- Aquí asegúrate de qué es userRecord si lo usas
      });
    });
  });
};


/**
 * Consulta los datos de un usuario y paciente en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición {req.body} Debe contener un `id` válido.
 * @postcondición Si el `id` es válido, se consulta el usuario y paciente en la base de datos y se retornan los datos correspondientes. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const getUsuario = async (req, res) => {
  const { id } = req.body;

  try {
    const result1 = await new Promise((resolve, reject) => {
      getUsuarioporId(id, (err, result) => {
        if (err) {
          reject({ error: 'Error al consultar la base de datos' });
        } else if (!result) {
          reject({ error: 'Usuario no encontrado' });
        } else {
          resolve(result);
        }
      });
    });

    const result2 = await new Promise((resolve, reject) => {
      getDatosPacienteporId(id, (err, result) => {
        if (err) {
          reject({ error: 'Error al consultar la base de datos' });
        } else if (!result) {
          reject({ error: 'Paciente no encontrado' });
        } else {
          resolve(result);
        }
      });
    });

    const combinedData = {
      usuario: result1,
      paciente: result2
    };

    return res.status(200).json({
      message: 'Datos obtenidos con éxito',
      data: combinedData
    });

  } catch (error) {
    return res.status(500).json({ error: error.error || 'Error interno del servidor' });
  }
};

/**
 * Consulta el nombre de un usuario en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición {req.body} Debe contener un `id` válido.
 * @postcondición Si el `id` es válido, se consulta el nombre del usuario y se retorna un mensaje con los datos. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const getNombreUsuario = (req, res) => {
  const { id } = req.body;

  console.log("Datos recibidos del frontend:", req.body);
  getNombreUsuarioporId(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    
  return res.status(201).json({
    message: 'Datos obtenidos con exito',
    data: result
  });
  });
};

/**
 * Consulta la lista de usuarios en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición Ninguna.
 * @postcondición Se consulta la lista de usuarios y se retorna un mensaje con los datos. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const getUsuarios = (req, res) => {
  getListaUsuarios((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al consultar la base de datos" });
    }

    if (!result || result.length === 0) {  
      return res.status(400).json({ error: "No se encontraron usuarios" });
    }
    return res.status(200).json({
      message: "Datos obtenidos con éxito",
      data: result,
    });
  });
};

/**
 * Verifica si el usuario tiene rol de administrador.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @param {Function} next - La siguiente función de middleware.
 * @returns {void}
 * 
 * @precondición {req.session.user} Debe estar definido y contener un `rol`.
 * @postcondición Si el rol del usuario es "admin", se permite el acceso a la siguiente operación. Si no es "admin", se retorna un error de acceso denegado.
 */
const verificarRolAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "No autorizado. Inicia sesión." });
  }

  if (req.session.user.rol !== "admin") {  
      return res.status(403).json({ error: "Acceso denegado. No tienes permisos." });
  }

  next();  
};

const crearUsuarioAdmin = async (req, res) => {
  const { datos } = req.body;

  if (!datos) {
    return res.status(400).json({ error: "Faltan datos obligatorios para crear el usuario" });
  }

   try {
    // 1. Crear usuario en Firebase
    const userRecord = await admin.auth().createUser({
      email: datos.correo,
      password: datos.password,
    });
    

  crearUsuario(
    datos.correo,
    datos.nombre,
    datos.password,
    datos.apellido1,
    datos.apellido2,
    datos.centro,
    (err, result) => {
      if (err) {
        console.log("datos", result)

        return res.status(500).json({ error: "Error al crear el usuario" });
      }


      const userId = result.id;
 

      actualizar(userId, datos.altura, datos.genero, datos.habitos_toxicos, datos.fecha_nacimiento, (err2, result2) => {
        if (err2) {
          return res.status(500).json({ error: "Error al actualizar datos del paciente" });
        }


        return res.status(201).json({
          
          message: "Usuario y paciente creados correctamente",
          data: { usuarioId: userId }
        });
      });
    }
  );
   } catch (error) {
         console.error("Error al crear usuario en Firebase:", error);
    return res.status(500).json({ error: "Error al crear el usuario" });

   }
};

const eliminarusuario = async (req, res) => {
  console.log("Llega a eliminar usuario");
  const { id, correo } = req.body;

  if (!id || !correo) {
    return res.status(400).json({ error: "Faltan parámetros para eliminar el usuario" });
  }

  try {
    // Eliminar en Firebase
    const userRecord = await admin.auth().getUserByEmail(correo);
    await admin.auth().deleteUser(userRecord.uid);

    // Eliminar en base de datos
    eliminarUsuarioporId(id, (err, result) => {
      if (err) {
        console.error("Error en eliminarUsuarioporId:", err);
        return res.status(500).json({ error: 'Error al eliminar el usuario en la base de datos' });
      }

      if (!result) {
        return res.status(400).json({ error: 'No se encontró el usuario para eliminar' });
      }

      return res.status(200).json({
        message: 'Usuario eliminado correctamente',
        data: result
      });
    });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ error: 'Error al eliminar el usuario (Firebase o base de datos)' });
  }
};



const editarUsuario = async (req, res) => {
  const { id, antiguocorreo, updatedData } = req.body;

  // Validación básica de entrada
  if (!id || !antiguocorreo || !updatedData) {
    return res.status(400).json({ error: "Faltan parámetros para actualizar los datos" });
  }

        if (antiguocorreo !== updatedData.correo) {
            // Busca el usuario en Firebase por el correo antiguo
            const userRecord = await admin.auth().getUserByEmail(antiguocorreo);
            await admin.auth().updateUser(userRecord.uid, {
                email: updatedData.correo,
            });
        }

  // Llamada a la función updatePacientePorId
  editarUsuarioporId(id, updatedData, (err, result) => {
    if (err) {
      // Si ocurre un error al actualizar los datos
      return res.status(500).json({ error: 'Error al actualizar los datos del paciente' });
    }

    if (!result) {
      // Si la actualización no retorna ningún resultado (por ejemplo, si no se actualizó ningún dato)
      return res.status(400).json({ error: 'Error al actualizar los datos del paciente en la base de datos' });
    }

    // Respuesta exitosa
    return res.status(200).json({
      message: 'Datos actualizados correctamente',
      data: result
    });
  });
};

const obtenerCorreo = (req, res) => {
  const { id} = req.body;

  // Validación básica de entrada
  if (!id) {
    return res.status(400).json({ error: "Faltan parámetros para actualizar los datos" });
  }

  // Llamada a la función updatePacientePorId
  getCorreo(id, (err, result) => {
    if (err) {
      // Si ocurre un error al actualizar los datos
      return res.status(500).json({ error: 'Error al obtener el correo del usuario' });
    }

    if (!result) {
      // Si la actualización no retorna ningún resultado (por ejemplo, si no se actualizó ningún dato)
      return res.status(400).json({ error: 'Error al actualizar los datos del paciente en la base de datos' });
    }

    // Respuesta exitosa
    return res.status(200).json({
      message: 'Datos actualizados correctamente',
      data: result
    });
  });
};

/**
 * Consulta la lista de usuarios en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición exista el centro pasado por parámetros.
 * @postcondición Se consulta la lista de usuarios y se retorna un mensaje con los datos. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const getUsuariosporCentro = (req, res) => {
  const {centro} = req.body;

  // Validación básica de entrada
  if (!centro) {
    return res.status(400).json({ error: "Faltan parámetros para obtener los datos" });
  }

  getListaUsuariosCentro(centro, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al consultar la base de datos" });
    }

    if (!result || result.length === 0) {  
      return res.status(400).json({ error: "No se encontraron usuarios" });
    }
    return res.status(200).json({
      message: "Datos obtenidos con éxito",
      data: result,
    });
  });
};

/**
 * Consulta la lista de usuarios en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición exista el centro pasado por parámetros.
 * @postcondición Se consulta la lista de usuarios y se retorna un mensaje con los datos. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const registroUsuarioAcceso = async (req, res) => {
  const { id } = req.body;

  // Validación básica de entrada
  if (!id) {
    return res.status(400).json({ error: "Faltan parámetros para registrar los datos" });
  }

  try {
    const result = await setRegistroUsuarioAcceso(id);

    return res.status(200).json({
      message: "Datos obtenidos con éxito",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({ error: "Error al consultar la base de datos" });
  }
};

/**
 * Consulta la lista de usuarios en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición exista el centro pasado por parámetros.
 * @postcondición Se consulta la lista de usuarios y se retorna un mensaje con los datos. Si ocurre un error, se devuelve el código de error correspondiente.
 */
const historialAcceso = (req, res) => {
  obtenerHistorial((err, result) => {
    if (err) {
      console.error("Error SQL:", err);
      return res.status(500).json({ error: "Error al consultar la base de datos" });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "No se encontraron registros" });
    }

    return res.status(200).json({
      message: "Datos obtenidos con éxito",
      data: result,
    });
  });
};

module.exports = {historialAcceso, registroUsuarioAcceso, inicioSesionUsuario, actualizarUsuarioGoogle, inicioSesionUsuarioGoogle, obtenerCorreo, registroUsuario, registroUsuarioGoogle, actualizarUsuario, setUsuario, getUsuario, getNombreUsuario, getUsuarios, eliminarusuario , crearUsuarioAdmin, verificarRolAdmin, editarUsuario, getUsuariosporCentro};
