const express = require('express');
const router = express.Router();
const { eliminarArritmia } = require('../controllers/pacienteController');

// Ruta POST para eliminar una arritmia
router.post('/', eliminarArritmia);

module.exports = router;