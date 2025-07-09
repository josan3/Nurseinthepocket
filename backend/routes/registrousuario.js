const express = require('express');
const router = express.Router();
const { registroUsuarioAcceso } = require('../controllers/usuarioController');

// Ruta POST para registrar el uso de la aplicación de un usuario
router.post('/', registroUsuarioAcceso);

module.exports = router;
