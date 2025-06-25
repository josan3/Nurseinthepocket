const express = require('express');
const router = express.Router();
const { getUsuarios } = require('../controllers/usuarioController');


// Ruta POST para obtener la lista de usuarios
router.post('/', getUsuarios);

module.exports = router;