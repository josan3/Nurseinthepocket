const express = require('express');
const router = express.Router();
const { registroUsuario } = require('../controllers/usuarioController');

// Ruta POST para registrarse
router.post('/', registroUsuario);

module.exports = router;
