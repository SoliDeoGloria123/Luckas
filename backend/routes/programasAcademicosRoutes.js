const express = require('express');
const router = express.Router();
const programasAcademicosController = require('../controllers/programasAcademicosController');
const { authJwt, role } = require('../middlewares');

// Ruta de prueba sin autenticación
router.get('/test', (req, res) => {
    res.json({ message: 'Rutas de programas académicos funcionando correctamente' });
});

// Ruta de prueba para crear programa sin autenticación (TEMPORAL)
router.post('/test-create', programasAcademicosController.crearPrograma);

// Rutas protegidas (requieren autenticación)

// Obtener todos los programas académicos (cursos y técnicos combinados)
router.get('/', [authJwt.verifyToken], programasAcademicosController.obtenerProgramas);

// Crear un nuevo programa académico (curso o técnico) (solo admin)
router.post('/', [authJwt.verifyToken, role.isAdmin], programasAcademicosController.crearPrograma);

// Actualizar un programa académico (curso o técnico) (solo admin)
router.put('/:id', [authJwt.verifyToken, role.isAdmin], programasAcademicosController.actualizarPrograma);

// Eliminar un programa académico (curso o técnico) (solo admin)
router.delete('/:id', [authJwt.verifyToken, role.isAdmin], programasAcademicosController.eliminarPrograma);

module.exports = router;
