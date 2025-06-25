const express = require('express');
const router = express.Router();
const { getPacienteFrecuencia } = require('../controllers/pacienteController');

// Ruta POST para obtener la frecuencia de un usuario
router.post('/', getPacienteFrecuencia);

module.exports = router;