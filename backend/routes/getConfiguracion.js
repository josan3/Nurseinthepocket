const express = require('express');
const router = express.Router();
const { getUsuario } = require('../controllers/usuarioController');

// Ruta POST para obtener la configuracion de un usuario
router.post('/', getUsuario);

module.exports = router;