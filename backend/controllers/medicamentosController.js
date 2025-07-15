const { application } = require('express');
const {getListaMedicamentos, setMedicamentoNuevo, eliminarMedicamentoporNombre, setTomaMedicamento, setTomaporDia, getTomaporIdPaciente, eliminarTomaporId, getListaTomaporIdPaciente, getIdToma, eliminarMedicamentoPorIdToma} = require('../models/medicamentosModel');

/**
 * Obtiene la lista de medicamentos desde la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición La solicitud no espera ningún parámetro en `req.body`.
 * @postcondición Si se encuentran medicamentos en la base de datos, se devuelve un código 200 con los datos. Si no se encuentran, se devuelve un error 400 con un mensaje adecuado. En caso de error de base de datos, se devuelve un código 500 con el mensaje correspondiente.
 */
const getMedicamentos = (req, res) => {
  getListaMedicamentos((err, result) => {
    console.log("Datos recibidos del back:", result);
    if (err) {
      return res.status(500).json({ error: "Error al consultar la base de datos" });
    }

    if (!result || result.length === 0) { 
      return res.status(400).json({ error: "No se encontraron medicamentos" });
    }

    return res.status(200).json({
      message: "Datos obtenidos con éxito",
      data: result,
    });
  });
};

/**
 * Agrega un nuevo medicamento a la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición El parámetro `nombre` debe ser un string válido que corresponde a un medicamento existente.
 * @postcondición Si el parámetro `nombre` es inválido, se devuelve un error con código 400. Si el medicamento se crea con éxito, se devuelve un código 201 con un mensaje de éxito con los datos obtenidos de la base de datos.
 */
const setMedicamento = (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  const {nombre} = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }

  setMedicamentoNuevo(nombre, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con éxito',
      data: result
    });
  });
};

/**
 * Asocia un medicamento a un paciente con la dosis y horarios de toma.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición Los parámetros `id`, `medicacion`, `numero_tomas` y `horas_tomas` deben estar presentes en `req.body`.
 * @postcondición Si alguno de los parámetros es inválido o nulo, se devuelve un error 400. Si la creación es exitosa, se devuelve un código 201 con el mensaje de éxito.
 */
const setPacienteMedicamento = (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  const {id, medicacion, numero_tomas, horas_tomas} = req.body;

  if (!id && !medicacion && !numero_tomas && !horas_tomas) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }

  setTomaMedicamento(id, medicacion, numero_tomas, horas_tomas, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con éxito',
      data: result
    });
  });
};

/**
 * Elimina un medicamento de la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición El parámetro `nombre` debe estar presente en `req.body`.
 * @postcondición Si el parámetro `nombre` es inválido o nulo, se devuelve un error 400. Si la eliminación es exitosa, se devuelve un código 201 con un mensaje de éxito.
 */
const eliminarMedicamento = (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  const {nombre} = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio para eliminar" });
  }

  eliminarMedicamentoporNombre(nombre, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Medicamento no encontrado' });
    }

    return res.status(200).json({
      message: 'Medicamento eliminado correctamente',
      data: result
    });
  });
};

/**
 * Registra una nueva toma de medicamento en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición Los parámetros `id_toma`, `fecha` y `hora` deben estar presentes en `req.body`.
 * @postcondición Si alguno de los parámetros es inválido o nulo, se devuelve un error 400. Si la creación es exitosa, se devuelve un código 201 con los datos obtenidos.
 */
const setToma = (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  const {id_toma, fecha, hora} = req.body;

  if (!id_toma || !fecha || !hora) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }

  setTomaporDia(id_toma, fecha, hora, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos', err });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con éxito',
      data: result
    });
  });
};

/**
 * Registra una toma de medicamento por paciente.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición Los parámetros `id_paciente`, `medicamento`, `hora`, y `fecha` deben estar presentes en `req.body`.
 * @postcondición Si alguno de los parámetros es inválido o nulo, se devuelve un error 400. Si la creación es exitosa, se devuelve un código 201 con los datos obtenidos.
 */
const setTomaporIdPaciente = (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  const {id_paciente, medicamento, hora} = req.body;

  if (!id_paciente || !medicamento || !hora) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }

  getIdToma(id_paciente, medicamento, hora, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con éxito',
      data: result
    });
  });
};

/**
 * Obtiene las tomas de medicamento de un paciente específico.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición El parámetro `id_paciente` debe estar presente en `req.body`.
 * @postcondición Si el parámetro `id_paciente` es inválido o nulo, se devuelve un error 400. Si las tomas son obtenidas con éxito, se devuelve un código 201 con los datos.
 */
const getTomasPaciente = (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  const {id_paciente} = req.body;

  if (!id_paciente) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }

  getTomaporIdPaciente(id_paciente, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con éxito',
      data: result
    });
  });
};

/**
 * Elimina una toma de medicamento de un paciente específico.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición Los parámetros `id_paciente`, `medicamento`, `fecha`, y `hora` deben estar presentes en `req.body`.
 * @postcondición Si alguno de los parámetros es inválido o nulo, se devuelve un error 400. Si la eliminación es exitosa, se devuelve un código 201 con un mensaje de éxito.
 */
const eliminarTomaPaciente = (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  const {id_paciente, medicamento, fecha, hora} = req.body;

  if (!id_paciente || !medicamento || !fecha || !hora) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }
  eliminarTomaporId(id_paciente, medicamento, fecha, hora, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }

    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con éxito',
      data: result
    });
  });
};

/**
 * Obtiene la lista completa de tomas de un paciente.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición El parámetro `id_paciente` debe estar presente en `req.body`.
 * @postcondición Si el parámetro `id_paciente` es inválido o nulo, se devuelve un error 400. Si se obtienen las tomas correctamente, se devuelve un código 201 con los datos obtenidos.
 */
const getListaToma = (req, res) => {
  console.log("Datos recibidos del frontend:", req.body);
  const {id_paciente} = req.body;

  if (!id_paciente) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }
  getListaTomaporIdPaciente(id_paciente, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos' });
    }
    if (!result) {
      return res.status(400).json({ error: 'Error al obtener los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Datos obtenidos con éxito',
      data: result
    });
  });
};

/**
 * Obtiene la lista completa de tomas de un paciente.
 * 
 * @param {Object} req - El objeto de solicitud.
 * @param {Object} res - El objeto de respuesta.
 * 
 * @returns {void} - No retorna ningún valor.
 * 
 * @precondición El parámetro `id_toma` debe estar presente en `req.body`.
 * @postcondición Si el parámetro `id_toma` es inválido o nulo, se devuelve un error 400. Si se elimina el medicamento correctamente, se devuelve un código 201 con los datos obtenidos.
 */
const eliminarMedicamentoPaciente = (req, res) => {

  const {id_toma} = req.body;

  if (!id_toma) {
    return res.status(400).json({ error: "Error al obtener los datos" });
  }
  eliminarMedicamentoPorIdToma(id_toma, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al acceder a la base de datos'. err });
    }
    if (!result) {
      return res.status(400).json({ error: 'Error al eliminar los datos de la base de datos' });
    }

    return res.status(201).json({
      message: 'Medicamento borrado con éxito',
    });
  });
};


  
module.exports = {getMedicamentos, setMedicamento, eliminarMedicamento, setPacienteMedicamento, setToma, getTomasPaciente, eliminarTomaPaciente, getListaToma, setTomaporIdPaciente, eliminarMedicamentoPaciente};