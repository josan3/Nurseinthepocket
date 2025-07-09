const express = require('express');
const router = express.Router();
const { historialAcceso } = require('../controllers/usuarioController');

// Ruta POST para registrar el uso de la aplicación de un usuario
router.get('/', historialAcceso);

module.exports = router;
