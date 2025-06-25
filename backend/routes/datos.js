const express = require('express');
const router = express.Router();
const { actualizarUsuario } = require('../controllers/usuarioController');

// Ruta POST para aportar datos un usuario
router.post('/', actualizarUsuario);

module.exports = router;
