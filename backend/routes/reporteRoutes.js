const express = require('express');
const router = express.Router();
const Reporte = require('../models/Reportes');

// Endpoint para listar reportes guardados
router.get('/listar', async (req, res) => {
	try {
		const reportes = await Reporte.find().sort({ createdAt: -1 });
		res.json({ success: true, data: reportes });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});
const { guardarReporte } = require('../controllers/guardarReporteController');
// Si tienes middlewares de autenticación, agrégalos aquí
// const { authJwt } = require('../middlewares');

// Ruta para guardar un reporte generado
router.post('/guardar', /* authJwt.verifyToken, */ guardarReporte);

module.exports = router;
