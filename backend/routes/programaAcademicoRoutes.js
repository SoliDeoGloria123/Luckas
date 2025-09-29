const express = require('express');
const router = express.Router();
const programaAcademicoController = require('../controllers/programaAcademicoController');

// Crear programa académico
router.post('/', programaAcademicoController.crearProgramaAcademico);

const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Obtener todos los programas académicos (admin, tesorero, seminarista, externo)
router.get('/', role.checkRole('admin', 'tesorero', 'seminarista', 'externo'), programaAcademicoController.obtenerProgramasAcademicos);

// Obtener programa académico por ID (admin, tesorero, seminarista, externo)
router.get('/:id', role.checkRole('admin', 'tesorero', 'seminarista', 'externo'), programaAcademicoController.obtenerProgramaAcademicoPorId);

// Actualizar programa académico
router.put('/:id', programaAcademicoController.actualizarProgramaAcademico);

// Eliminar programa académico
router.delete('/:id', programaAcademicoController.eliminarProgramaAcademico);

module.exports = router;
