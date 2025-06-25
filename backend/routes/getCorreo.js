const express = require('express');
const router = express.Router();
const { obtenerCorreo } = require('../controllers/usuarioController');

// Ruta POST para obtener la configuracion de un usuario
router.post('/', obtenerCorreo);

module.exports = router;