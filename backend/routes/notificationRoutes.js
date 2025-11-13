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

// Obtener conteo de notificaciones no leídas
router.get('/unread-count', notificationController.getUnreadCount);

// Marcar notificación como leída
router.put('/read', notificationController.markAsRead);

// Marcar todas las notificaciones como leídas
router.put('/read-all', notificationController.markAllAsRead);

// Eliminar una notificación específica
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
