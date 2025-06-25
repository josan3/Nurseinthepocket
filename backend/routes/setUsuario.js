const express = require('express');
const router = express.Router();
const {crearUsuarioAdmin} = require('../controllers/usuarioController');

// Ruta POST para añadir una toma a un usuario mediante un id de un paciente
router.post('/', crearUsuarioAdmin);

module.exports = router;
