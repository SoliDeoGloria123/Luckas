const express = require('express');
const router = express.Router();
const programaAcademicoController = require('../controllers/programaAcademicoController');

// Crear programa académico
router.post('/', programaAcademicoController.crearProgramaAcademico);

// Obtener todos los programas académicos
router.get('/', programaAcademicoController.obtenerProgramasAcademicos);

// Obtener programa académico por ID
router.get('/:id', programaAcademicoController.obtenerProgramaAcademicoPorId);

// Actualizar programa académico
router.put('/:id', programaAcademicoController.actualizarProgramaAcademico);

// Eliminar programa académico
router.delete('/:id', programaAcademicoController.eliminarProgramaAcademico);

module.exports = router;
