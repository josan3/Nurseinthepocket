
const express = require('express');
const router = express.Router();
const {eliminarusuario} = require('../controllers/usuarioController');

console.log('Ruta de eliminar usuario');
router.post('/', eliminarusuario);

module.exports = router;

