const express = require('express');
const router = express.Router();
const { getPacientePeso } = require('../controllers/pacienteController');

// Ruta POST para obtener el peso de un usuario
router.post('/', getPacientePeso);

module.exports = router;
