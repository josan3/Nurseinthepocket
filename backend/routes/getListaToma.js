const express = require('express');
const router = express.Router();
const { getListaToma } = require('../controllers/medicamentosController');

// Ruta POST para login
router.post('/',  getListaToma);

module.exports = router;