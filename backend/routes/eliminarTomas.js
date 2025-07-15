const express = require('express');
const router = express.Router();
const {eliminarTomaPaciente } = require('../controllers/medicamentosController');

router.delete('/', eliminarTomaPaciente);

module.exports = router;