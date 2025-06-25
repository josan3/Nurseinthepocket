const express = require('express');
const router = express.Router();
const {getTomasPaciente} = require('../controllers/medicamentosController');

// Ruta POST para obtener las tomas de medicacion de un usuario
router.post('/', getTomasPaciente);

module.exports = router;