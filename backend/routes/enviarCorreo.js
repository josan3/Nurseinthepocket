const express = require('express');
const router = express.Router();
const { enviarCorreo } = require('../models/correoModel');

// Ruta POST para enviar un correo a la asociacion
router.post('/', enviarCorreo);

module.exports = router;
