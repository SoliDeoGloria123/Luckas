const express = require('express');
const router = express.Router();
const certificadoController = require('../controllers/certificadoControllers');
const { verifyToken } = require('../middlewares/authJwt');

router.post('/generar', verifyToken, certificadoController.generarCertificado);
// Ruta para obtener estadísticas de certificados
router.get('/estadisticas', verifyToken, certificadoController.obtenerEstadisticasCertificados);

module.exports = router;