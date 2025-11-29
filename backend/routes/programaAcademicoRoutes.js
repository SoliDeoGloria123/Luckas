const express = require('express');
const router = express.Router();
const programaAcademicoController = require('../controllers/programaAcademicoController');
const { authJwt, role } = require('../middlewares');

//ruta publica para obtener programas academicos
router.get('/', programaAcademicoController.obtenerProgramasAcademicos);

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Crear programa académico (solo admin y tesorero)
router.post('/', role.checkRole('admin', 'tesorero'), programaAcademicoController.crearProgramaAcademico);

// Obtener todos los programas académicos (admin, tesorero, seminarista, externo)
router.get('/', role.checkRole('admin', 'tesorero', 'seminarista', 'externo'), programaAcademicoController.obtenerProgramasAcademicos);

// Obtener estadísticas de programas académicos (solo admin y tesorero)
router.get('/estadisticas', role.checkRole('admin', 'tesorero'), programaAcademicoController.obtenerEstadisticasProgramas);

// Obtener programa académico por ID (admin, tesorero, seminarista, externo)
router.get('/:id', role.checkRole('admin', 'tesorero', 'seminarista', 'externo'), programaAcademicoController.obtenerProgramaAcademicoPorId);

// Actualizar programa académico (solo admin y tesorero)
router.put('/:id', role.checkRole('admin', 'tesorero'), programaAcademicoController.actualizarProgramaAcademico);

// Eliminar programa académico (solo admin)
router.delete('/:id', role.isAdmin, programaAcademicoController.eliminarProgramaAcademico);


module.exports = router;
