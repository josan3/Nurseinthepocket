const { application } = require('express');
const {getPeso, setPeso, setFrecuencia, getFrecuencia, setTension, getTension, setArritmia, getArritmia, actualizarPacientePorId, getPacienteporId, getAlarmasPaciente, eliminarArritmiaporId} = require('../models/pacientesModel');
const {getIdporNombreUsuario} = require('../models/usuarioModel');

/**
 * Obtiene el peso de un paciente dado su ID.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con el `id` del paciente.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const getPacientePeso = (req, res) => {
  const {id} = req.body;

  if (!id) {
    return res.status(400).json({ error: "Error al obtener el id" });
  }

  getPeso(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con exito',
      data: result
    });
  });
};

/**
 * Establece el peso de un paciente dado su ID y peso.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con el `id` y `weight` del paciente.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const setPacientePeso = (req, res) => {
  const {id, weight} = req.body;

  if (!id || !weight) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }

  setPeso(id, weight, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con exito',
      data: result
    });
  });
};

/**
 * Obtiene la frecuencia de un paciente dado su ID.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con el `id` del paciente.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const getPacienteFrecuencia = (req, res) => {
  const {id} = req.body;

  if (!id) {
    return res.status(400).json({ error: "Error al obtener el id" });
  }

  getFrecuencia(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con exito',
      data: result
    });
  });
};

/**
 * Establece la frecuencia de un paciente dado su ID y frecuencia.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con el `id` y `frecuencia` del paciente.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const setPacienteFrecuencia = (req, res) => {
  const {id, frecuencia} = req.body;

  if (!id || !frecuencia) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }

  setFrecuencia(id, frecuencia, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con exito',
      data: result
    });
  });
};

/**
 * Obtiene la tensión de un paciente dado su ID.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con el `id` del paciente.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const getPacienteTension = (req, res) => {
  const {id} = req.body;

  if (!id) {
    return res.status(400).json({ error: "Error al obtener el id" });
  }

  getTension(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con exito',
      data: result
    });
  });
};

/**
 * Establece la tensión de un paciente dado su ID, tensión máxima y mínima.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con el `id`, `tension_max`, y `tension_min` del paciente.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const setPacienteTension = (req, res) => {
  const {id, tension_max, tension_min} = req.body;

  if (!id || !tension_max || !tension_min) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }

  setTension(id, tension_max, tension_min, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con exito',
      data: result
    });
  });
};

/**
 * Obtiene la arritmia de un paciente dado su ID.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con el `id` del paciente.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const getPacienteArritmia = (req, res) => {
  const {id} = req.body;

  if (!id) {
    return res.status(400).json({ error: "Error al obtener el id" });
  }

  getArritmia(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con exito',
      data: result
    });
  });
};

/**
 * Establece la arritmia de un paciente dado su ID y fecha.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con el `id` y `fecha` del paciente.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const setPacienteArritmia = (req, res) => {
  const {id, fecha} = req.body;

  if (!id || !fecha) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }

  setArritmia(id, fecha, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con exito',
      data: result
    });
  });
};

/**
 * Obtiene los datos de un paciente dado su nombre y apellidos.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con `nombre`, `apellido1`, y `apellido2` del paciente.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const getPaciente = (req, res) => {
  const { nombre, apellido1, apellido2, fecha_nacimiento } = req.body;

  if (!nombre || !apellido1 || !apellido2 || !fecha_nacimiento) {
    return res.status(400).json({ error: "Faltan datos del paciente (nombre, apellido1, apellido2, fecha_nacimeinto)" });
  }

  getIdporNombreUsuario(nombre, apellido1, apellido2, fecha_nacimiento,  (err, idResult) => {
    if (err) {
      return res.status(500).json({ error: "Error al consultar la base de datos" });
    }

    if (!idResult) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const id = idResult.id;

    getPacienteporId(id, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error al consultar la base de datos" });
      }

      if (!result) {
        return res.status(404).json({ error: "Datos del usuario no encontrados" });
      }

      return res.status(200).json({
        message: "Datos obtenidos con éxito",
        data: result,
        id: id,
      });
    });
  });
};

const actualizarPaciente = (req, res) => {
  const { id, updatedData } = req.body;

  // Validación básica de entrada
  if (!id || !updatedData) {
    return res.status(400).json({ error: "Faltan parámetros para actualizar los datos" });
  }

  // Llamada a la función updatePacientePorId
  actualizarPacientePorId(id, updatedData, (err, result) => {
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


/**
 * Obtiene las alarmas asociadas a un paciente dado su ID.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con el `id` del paciente.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const getAlarmas = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Error al obtener el id" });
  }

  getAlarmasPaciente(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con exito',
      data: result
    });
  });
};

/**
 * Elimina una arritmia del paciente dado su ID y fecha.
 * 
 * @param {Object} req - La solicitud HTTP que contiene el cuerpo con `id` y `fecha` de la arritmia.
 * @param {Object} res - La respuesta HTTP para enviar los resultados.
 * 
 * @returns {void}
 */
const eliminarArritmia = (req, res) => {
  const {id, fecha} = req.body;

  if (!id || !fecha) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }

  eliminarArritmiaporId(id, fecha, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con exito',
      data: result
    });
  });
};



module.exports = {setPacientePeso, getPacientePeso, getPacienteFrecuencia, setPacienteFrecuencia, actualizarPaciente , getPacienteTension, setPacienteTension, getPacienteArritmia, setPacienteArritmia, getPaciente, getAlarmas, eliminarArritmia};