const express = require('express');
const router = express.Router();
const { actualizarUsuarioGoogle } = require('../controllers/usuarioController');

// Ruta POST para aportar datos un usuario
router.post('/', actualizarUsuarioGoogle);

module.exports = router;
