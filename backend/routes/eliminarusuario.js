const express = require('express');
const router = express.Router();
const {eliminarusuario} = require('../controllers/usuarioController');

console.log('Ruta de eliminar usuario');
router.delete('/', eliminarusuario);

module.exports = router;

