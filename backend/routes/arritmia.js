const express = require('express');
const router = express.Router();
const {setPacienteArritmia } = require('../controllers/pacienteController');

// Ruta POST para añadir una arritmia a un paciente
router.post('/', setPacienteArritmia);

module.exports = router;
