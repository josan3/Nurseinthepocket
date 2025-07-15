const express = require('express');
const router = express.Router();
const { getUsuarios } = require('../controllers/usuarioController');

router.get('/', getUsuarios);

module.exports = router;