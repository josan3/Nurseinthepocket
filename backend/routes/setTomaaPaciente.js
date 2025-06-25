const express = require('express');
const router = express.Router();
const {setTomaporIdPaciente} = require('../controllers/medicamentosController');

// Ruta POST para añadir una toma a un usuario mediante un id de un paciente
router.post('/', setTomaporIdPaciente);

module.exports = router;
