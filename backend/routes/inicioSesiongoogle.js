const express = require('express');
const router = express.Router();
const { inicioSesionUsuarioGoogle } = require('../controllers/usuarioController');

// Ruta POST para inicar sesion
router.post('/', inicioSesionUsuarioGoogle);

module.exports = router;
