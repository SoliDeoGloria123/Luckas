const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (todos los roles autenticados)
router.get('/', inscripcionController.obtenerInscripciones);
router.get('/datos-para-crear', inscripcionController.obtenerDatosParaInscripcion); // Ruta temporal para debug
router.get('/:id', inscripcionController.obtenerInscripcionPorId);

// Obtener inscripciones por usuario
router.get('/usuario/:userId', inscripcionController.obtenerInscripcionesPorUsuario);

// Rutas de creación y modificación (admin, tesorero y seminarista)
router.post('/', role.checkRole('admin', 'tesorero', 'seminarista','externo'), inscripcionController.crearInscripcion);
router.put('/:id', role.checkRole('admin', 'tesorero','seminarista','externo'), inscripcionController.actualizarInscripcion);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, inscripcionController.eliminarInscripcion);


module.exports = router;