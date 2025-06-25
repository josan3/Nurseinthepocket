const express = require('express');
const router = express.Router();
const { registroUsuarioGoogle } = require('../controllers/usuarioController');

// Ruta POST para registrarse
router.post('/', registroUsuarioGoogle);

module.exports = router;
