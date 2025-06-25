const express = require('express');
const router = express.Router();
const {setPacienteTension} = require('../controllers/pacienteController');

// Ruta POST para añadir una tension a un usuario
router.post('/', setPacienteTension);

module.exports = router;
