const express = require('express');
const router = express.Router();
const { eliminarMedicamentoPaciente } = require('../controllers/medicamentosController');

router.delete('/', eliminarMedicamentoPaciente);

module.exports = router;