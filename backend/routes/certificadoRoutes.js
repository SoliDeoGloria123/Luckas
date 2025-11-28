const express = require('express');
const router = express.Router();
const certificadoController = require('../controllers/certificadoControllers');
const { authJwt, role } = require('../middlewares');

// Middleware de autenticación para todas las rutas
router.use(authJwt.verifyToken);

// Solo admin y tesorero pueden generar certificados
router.post('/generar', role.checkRole('admin', 'tesorero'), certificadoController.generarCertificado);
// Solo admin y tesorero pueden obtener estadísticas de certificados
router.get('/estadisticas',role.checkRole('admin', 'tesorero'), certificadoController.obtenerEstadisticasCertificados);

module.exports = router;