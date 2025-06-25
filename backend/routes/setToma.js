const express = require('express');
const router = express.Router();
const {setToma} = require('../controllers/medicamentosController');

// Ruta POST para añadir una toma a un usuario
router.post('/', setToma);

module.exports = router;
