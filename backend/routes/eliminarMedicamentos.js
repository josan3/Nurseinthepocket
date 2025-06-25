const express = require('express');
const router = express.Router();
const { eliminarMedicamento } = require('../controllers/medicamentosController');

// Ruta POST para eliminar un medicamento
router.post('/', eliminarMedicamento);

module.exports = router;