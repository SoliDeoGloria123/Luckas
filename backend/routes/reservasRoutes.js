const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de consulta (todos los roles autenticados)
router.get('/', reservasController.obtenerReservas);
router.get('/datos-para-crear', reservasController.obtenerDatosParaReserva); // Ruta temporal para debug
router.get('/:id', reservasController.obtenerReservaPorId);

// Rutas de creación y modificación (admin, tesorero y seminarista)
router.post('/', role.checkRole('admin', 'tesorero', 'seminarista','externo'), reservasController.crearReserva);
router.put('/:id', role.checkRole('admin', 'tesorero', 'seminarista','externo'), reservasController.actualizarReserva);

// Rutas de eliminación (solo admin)
router.delete('/:id', role.isAdmin, reservasController.eliminarReserva);

module.exports = router;