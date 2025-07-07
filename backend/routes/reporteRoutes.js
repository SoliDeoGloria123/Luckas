const express = require('express');
const router = express.Router();
const { guardarReporte } = require('../controllers/guardarReporteController');
// Si tienes middlewares de autenticación, agrégalos aquí
// const { authJwt } = require('../middlewares');

// Ruta para guardar un reporte generado
router.post('/guardar', /* authJwt.verifyToken, */ guardarReporte);

module.exports = router;
