const express = require("express");
const router = express.Router();
const contactoController = require("../controllers/contactoController");

// Rutas para enviar mensajes
router.post("/enviar-mensaje", contactoController.enviarMensaje);
router.post("/enviar-soporte", contactoController.enviarReporteSoporte);

module.exports = router;
