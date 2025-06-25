const express = require('express');
const router = express.Router();
const {eliminarTomaPaciente } = require('../controllers/medicamentosController');

// Ruta POST para eliminar una toma de un medicamento
router.post('/', eliminarTomaPaciente);

module.exports = router;