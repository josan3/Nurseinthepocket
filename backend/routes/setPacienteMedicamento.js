const express = require('express');
const router = express.Router();
const { setPacienteMedicamento } = require('../controllers/medicamentosController');

// Ruta POST para añadir un medicamento a un usuario
router.post('/', setPacienteMedicamento);

module.exports = router;