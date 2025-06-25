const express = require('express');
const router = express.Router();
const { getPacienteArritmia } = require('../controllers/pacienteController');

// Ruta POST para obtener las arritmias de un usuario
router.post('/', getPacienteArritmia);

module.exports = router;