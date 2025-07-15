const express = require('express');
const router = express.Router();
const { getCentros } = require('../controllers/usuarioController');

// Ruta POST para registrar el uso de la aplicación de un usuario
router.get('/', getCentros);

module.exports = router;
