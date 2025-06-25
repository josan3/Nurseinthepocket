const express = require('express');
const router = express.Router();
const { getMedicamentos } = require('../controllers/medicamentosController');

// Ruta POST para obtener la lista de medicamentos
router.post('/',  getMedicamentos);

module.exports = router;