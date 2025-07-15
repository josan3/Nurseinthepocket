const express = require('express');
const router = express.Router();
const { eliminarArritmia } = require('../controllers/pacienteController');

router.delete('/', eliminarArritmia);

module.exports = router;