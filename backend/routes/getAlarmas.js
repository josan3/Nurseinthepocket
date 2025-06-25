const express = require('express');
const router = express.Router();
const { getAlarmas } = require('../controllers/pacienteController');

// Ruta POST para obtener las alarmas de un usuario
router.post('/', getAlarmas);

module.exports = router;