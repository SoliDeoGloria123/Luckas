const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (todos los roles autenticados)
router.get('/', inscripcionController.obtenerInscripciones);
router.get('/datos-para-crear', inscripcionController.obtenerDatosParaInscripcion); // Ruta temporal para debug
// Ruta para obtener estadísticas de inscripciones
router.get('/estadisticas', role.checkRole('admin', 'tesorero', 'seminarista'), inscripcionController.obtenerEstadisticasInscripciones);

// Obtener inscripciones por usuario
router.get('/usuario/:userId', inscripcionController.obtenerInscripcionesPorUsuario);

// Obtener inscripción por ID (dejar al final para no interferir con rutas específicas)
router.get('/:id', inscripcionController.obtenerInscripcionPorId);

// Rutas de creación y modificación (admin, tesorero y seminarista)
router.post('/', role.checkRole('admin', 'tesorero', 'seminarista','externo'), inscripcionController.crearInscripcion);
router.put('/:id', role.checkRole('admin', 'tesorero','seminarista','externo'), inscripcionController.actualizarInscripcion);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, inscripcionController.eliminarInscripcion);



module.exports = router;