const express = require('express');
const router = express.Router();
const programasTecnicosController = require('../controllers/programasTecnicosController');
const { authJwt, role } = require('../middlewares');

// Rutas públicas (para usuarios externos que quieren ver programas disponibles)
router.get('/publicos', programasTecnicosController.obtenerProgramasTecnicos);
router.get('/publicos/:id', programasTecnicosController.obtenerProgramaTecnicoPorId);

// Obtener estadísticas de programas técnicos (solo admin) - Debe ir antes de /:id
router.get('/admin/estadisticas', [authJwt.verifyToken, role.isAdmin], programasTecnicosController.obtenerEstadisticas);

// Rutas protegidas (requieren autenticación)
// Obtener todos los programas técnicos (con filtros)
router.get('/', [authJwt.verifyToken], programasTecnicosController.obtenerProgramasTecnicos);

// Crear un nuevo programa técnico (solo admin)
router.post('/', [authJwt.verifyToken, role.isAdmin], programasTecnicosController.crearProgramaTecnico);

// Inscribir usuario en un programa técnico
router.post('/:id/inscribir', [authJwt.verifyToken], programasTecnicosController.inscribirUsuario);

// Obtener progreso de un estudiante en un programa
router.get('/:id/progreso/:usuarioId', [authJwt.verifyToken], programasTecnicosController.obtenerProgresoEstudiante);

// Obtener un programa técnico específico
router.get('/:id', [authJwt.verifyToken], programasTecnicosController.obtenerProgramaTecnicoPorId);

// Actualizar un programa técnico (solo admin)
router.put('/:id', [authJwt.verifyToken, role.isAdmin], programasTecnicosController.actualizarProgramaTecnico);

// Eliminar un programa técnico (solo admin)
router.delete('/:id', [authJwt.verifyToken, role.isAdmin], programasTecnicosController.eliminarProgramaTecnico);

module.exports = router;

