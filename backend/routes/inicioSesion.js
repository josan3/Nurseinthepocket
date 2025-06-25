const express = require('express');
const router = express.Router();
const { inicioSesionUsuario } = require('../controllers/usuarioController');

// Ruta POST para inicar sesion
router.post('/', inicioSesionUsuario);

module.exports = router;
