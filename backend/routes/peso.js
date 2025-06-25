const express = require('express');
const router = express.Router();
const { setPacientePeso } = require('../controllers/pacienteController');

// Ruta POST para añadir un peso a un usuario
router.post('/', setPacientePeso);

module.exports = router;
