const express = require('express');
const router = express.Router();
const { 
  crearCategoria, 
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
  categorizarSolicitud 
} = require('../controllers/categorizacionController');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (todos los roles autenticados)
router.get('/', obtenerCategorias);
router.get('/:id', obtenerCategoriaPorId);

// Rutas de creación y modificación (admin y tesorero)
router.post('/', role.checkRole('admin', 'tesorero'), crearCategoria);
router.put('/:id', role.checkRole('admin', 'tesorero'), actualizarCategoria);
router.put('/solicitud/:id/categorizar', role.checkRole('admin', 'tesorero'), categorizarSolicitud);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, eliminarCategoria);

module.exports = router;

