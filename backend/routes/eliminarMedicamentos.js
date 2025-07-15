const express = require('express');
const router = express.Router();
const { eliminarMedicamento } = require('../controllers/medicamentosController');

router.delete('/', eliminarMedicamento);

module.exports = router;