// backend/routes/pagosRoutes.js
const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');
const { authJwt } = require('../middlewares');

// Rutas para pagos
router.post('/pse', [authJwt.verifyToken], pagosController.procesarPSE);
router.post('/nequi', [authJwt.verifyToken], pagosController.procesarNequi);
router.get('/status/:transactionId', pagosController.consultarEstado);
router.post('/webhook', pagosController.webhook);

module.exports = router;
