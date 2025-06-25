const express = require('express');
const router = express.Router();
const {actualizarPaciente } = require('../controllers/pacienteController');

// Ruta POST para añadir una arritmia a un paciente
router.post('/', actualizarPaciente);

module.exports = router;
