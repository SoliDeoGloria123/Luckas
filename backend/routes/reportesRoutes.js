const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesControllers');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Rutas de reportes (solo admin y tesorero pueden ver reportes)
router.get('/', role.checkRole('admin', 'tesorero'), (req, res) => {
    res.json({
        success: true,
        message: 'API de reportes funcionando',
        availableReports: [
            '/dashboard',
            '/reservas', 
            '/inscripciones',
            '/solicitudes',
            '/usuarios',
            '/eventos',
            '/financiero',
            '/actividad-usuarios'
        ]
    });
});

router.get('/dashboard', role.checkRole('admin', 'tesorero'), reportesController.getDashboardReport);
router.get('/reservas', role.checkRole('admin', 'tesorero'), reportesController.getReservasReport);
router.get('/inscripciones', role.checkRole('admin', 'tesorero'), reportesController.getInscripcionesReport);
router.get('/solicitudes', role.checkRole('admin', 'tesorero'), reportesController.getSolicitudesReport);
router.get('/usuarios', role.checkRole('admin', 'tesorero'), reportesController.getUsuariosReport);
router.get('/eventos', role.checkRole('admin', 'tesorero'), reportesController.getEventosReport);
router.get('/financiero', role.checkRole('admin', 'tesorero'), reportesController.getReporteFinanciero);
router.get('/actividad-usuarios', role.checkRole('admin', 'tesorero'), reportesController.getActividadUsuarios);

module.exports = router;