const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authJwt } = require('../middlewares');

// Todas las rutas requieren autenticación
router.use(authJwt.verifyToken);

// Crear notificación
router.post('/', notificationController.createNotification);

// Obtener notificaciones del usuario autenticado
router.get('/', notificationController.getUserNotifications);

// Marcar notificación como leída
router.put('/read', notificationController.markAsRead);

module.exports = router;
