const express = require('express');
const router = express.Router();
const { setUsuario } = require('../controllers/usuarioController');

router.put('/', setUsuario);

module.exports = router;