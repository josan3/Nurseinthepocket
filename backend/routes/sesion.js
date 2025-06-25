const express = require('express');
const router = express.Router();
const { verificarRolAdmin } = require('../controllers/usuarioController');

// Ruta POST para verificar que un usuario es administrador
router.post('/', verificarRolAdmin);

module.exports = router;
