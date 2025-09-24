const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (todos los roles autenticados)
router.get('/usuario/:usuarioId', tareaController.obtenerTareasPorUsuario); // Esta ruta debe ir primero
router.get('/:id', tareaController.obtenerTareaPorId);
router.get('/', tareaController.obtenerTareas);

// Rutas de creación y modificación (admin y tesorero)
router.post('/', role.checkRole('admin', 'tesorero','seminarista'), tareaController.crearTarea);
router.put('/:id', role.checkRole('admin', 'tesorero','seminarista'), tareaController.actualizarTarea);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, tareaController.eliminarTarea);

module.exports = router;