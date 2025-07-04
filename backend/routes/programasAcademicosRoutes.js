const express = require('express');
const router = express.Router();
const programasAcademicosController = require('../controllers/programasAcademicosController');
const { authJwt, role } = require('../middlewares');

// Rutas públicas (no requieren autenticación)
router.get('/', programasAcademicosController.obtenerProgramas);
router.get('/publicos', programasAcademicosController.obtenerProgramas);
router.get('/:id', programasAcademicosController.obtenerProgramaPorId);

// Rutas para usuarios autenticados
router.post('/:id/inscribir', [authJwt.verifyToken], programasAcademicosController.inscribirUsuario);
router.delete('/:id/cancelar-inscripcion', [authJwt.verifyToken], programasAcademicosController.cancelarInscripcion);
router.get('/mis/inscripciones', [authJwt.verifyToken], programasAcademicosController.obtenerMisInscripciones);

// Rutas solo para administradores
router.post('/', [authJwt.verifyToken, role.isAdmin], programasAcademicosController.crearPrograma);
router.put('/:id', [authJwt.verifyToken, role.isAdmin], programasAcademicosController.actualizarPrograma);
router.delete('/:id', [authJwt.verifyToken, role.isAdmin], programasAcademicosController.eliminarPrograma);
router.get('/admin/estadisticas', [authJwt.verifyToken, role.isAdmin], programasAcademicosController.obtenerEstadisticas);

module.exports = router;
