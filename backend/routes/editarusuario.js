const express = require('express');
const router = express.Router();
const {editarUsuario} = require('../controllers/usuarioController');

router.put('/', editarUsuario);

module.exports = router;
