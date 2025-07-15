const express = require('express');
const router = express.Router();
const { getPacienteArritmia } = require('../controllers/pacienteController');

router.post('/', getPacienteArritmia);

module.exports = router;