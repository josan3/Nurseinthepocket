const express = require('express');
const router = express.Router();
const { notificacion } = require('../controllers/notificacionController');

// Ruta POST para mandar una notificacion al usuario
router.post('/', notificacion);

module.exports = router;
