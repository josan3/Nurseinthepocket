const express = require('express');
const router = express.Router();
const { getNombreUsuario } = require('../controllers/usuarioController');

// Ruta POST para obtener el nombre de un usuario
router.post('/', getNombreUsuario);

module.exports = router;