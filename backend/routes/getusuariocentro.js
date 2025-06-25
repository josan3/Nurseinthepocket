const express = require('express');
const router = express.Router();
const { getUsuariosporCentro } = require('../controllers/usuarioController');


// Ruta POST para obtener la lista de usuarios
router.post('/', getUsuariosporCentro);

module.exports = router;