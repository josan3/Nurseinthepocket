const express = require('express');
const router = express.Router();
const { eliminarMedicamentoPaciente } = require('../controllers/medicamentosController');

// Ruta POST para eliminar un medicamento
router.post('/', eliminarMedicamentoPaciente);

module.exports = router;