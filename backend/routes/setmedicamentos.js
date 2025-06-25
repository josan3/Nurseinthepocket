const express = require('express');
const router = express.Router();
const { setMedicamento } = require('../controllers/medicamentosController');

// Ruta POST para añadir un medicamento a un usuario
router.post('/', setMedicamento);

module.exports = router;