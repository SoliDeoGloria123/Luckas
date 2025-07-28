const express = require('express');
const router = express.Router();
const {uploadMultiple} = require('../middlewares/upload');
const { 
  crearCabana, 
  obtenerCabanas,
  obtenerCabanaPorId,
  actualizarCabana,
  eliminarCabana,
  categorizarCabana 
} = require('../controllers/cabanasController');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (todos los roles autenticados)
router.get('/', obtenerCabanas);
router.get('/:id', obtenerCabanaPorId);

// Rutas de creación y modificación (admin y tesorero)
router.post('/',(req, res, next) => { req.tipoImagen = 'cabanas'; next(); }, uploadMultiple, role.checkRole('admin', 'tesorero'), crearCabana);
router.put('/:id',(req, res, next) => { req.tipoImagen = 'cabanas'; next();},uploadMultiple, role.checkRole('admin', 'tesorero'), actualizarCabana);
router.put('/:id/categorizar', role.checkRole('admin', 'tesorero'), categorizarCabana);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, eliminarCabana);

module.exports = router;