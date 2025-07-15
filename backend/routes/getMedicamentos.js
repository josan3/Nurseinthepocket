const express = require('express');
const router = express.Router();
const { getMedicamentos } = require('../controllers/medicamentosController');

router.get('/',  getMedicamentos);

module.exports = router;