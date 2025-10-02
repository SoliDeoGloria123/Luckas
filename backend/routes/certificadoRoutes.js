const express = require('express');
const router = express.Router();
const certificadoController = require('../controllers/certificadoControllers');
const { verifyToken } = require('../middlewares/authJwt');

router.post('/generar', verifyToken, certificadoController.generarCertificado);

module.exports = router;