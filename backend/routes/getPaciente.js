const express = require('express');
const router = express.Router();
const { getPaciente } = require('../controllers/pacienteController');

// Ruta POST para obtener los datos de un paciente
router.post('/', getPaciente);

module.exports = router;