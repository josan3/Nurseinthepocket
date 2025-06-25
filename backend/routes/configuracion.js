const express = require('express');
const router = express.Router();
const { setUsuario } = require('../controllers/usuarioController');

// Ruta POST para crear un usuario
router.post('/', setUsuario);

module.exports = router;