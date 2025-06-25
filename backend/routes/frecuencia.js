const express = require('express');
const router = express.Router();
const {setPacienteFrecuencia } = require('../controllers/pacienteController');

// Ruta POST para añadir una frecuencia a un usuario
router.post('/', setPacienteFrecuencia);

module.exports = router;
