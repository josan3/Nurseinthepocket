const express = require('express');
const router = express.Router();
const { getPacienteTension } = require('../controllers/pacienteController');

// Ruta POST para obtener la tension de un paciente
router.post('/', getPacienteTension);

module.exports = router;