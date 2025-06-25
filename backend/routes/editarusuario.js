const express = require('express');
const router = express.Router();
const {editarUsuario} = require('../controllers/usuarioController');

// Ruta POST para añadir una toma a un usuario mediante un id de un paciente
router.post('/', editarUsuario);

module.exports = router;
