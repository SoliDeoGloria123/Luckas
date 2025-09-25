const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');
const { authJwt, role } = require('../middlewares');

// Rutas públicas (para usuarios externos que quieren ver cursos disponibles)
router.get('/publicos', cursosController.obtenerCursosPublicos);
router.get('/publicos/:id', cursosController.obtenerCursoPorId);

// Obtener estadísticas de cursos (solo admin) - Debe ir antes de /:id
router.get('/admin/estadisticas', [authJwt.verifyToken, role.isAdmin], cursosController.obtenerEstadisticas);

// Rutas protegidas (requieren autenticación)
// Obtener todos los cursos (con filtros)
router.get('/', [authJwt.verifyToken], cursosController.obtenerCursos);

// Crear un nuevo curso (solo admin)
router.post('/', [authJwt.verifyToken, role.isAdmin], cursosController.crearCurso);

// Inscribir usuario en un curso
router.post('/:id/inscribir', [authJwt.verifyToken], cursosController.inscribirUsuario);

// Obtener un curso específico
router.get('/:id', [authJwt.verifyToken], cursosController.obtenerCursoPorId);

// Actualizar un curso (solo admin)
router.put('/:id', [authJwt.verifyToken, role.isAdmin], cursosController.actualizarCurso);

// Eliminar un curso (solo admin)
router.delete('/:id', [authJwt.verifyToken, role.isAdmin], cursosController.eliminarCurso);

module.exports = router;
