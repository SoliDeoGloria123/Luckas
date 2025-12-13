const Notification = require('../models/Notification');

/**
 * Crear y emitir notificación en tiempo real
 */
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, icon, type } = req.body;
    const notification = new Notification({ userId, title, message, icon });
    await notification.save();

    // Emitir por Socket.IO en tiempo real
    const io = req.app.get('io');
    if (io && userId) {
      io.to(`user_${userId}`).emit('nueva-notificacion', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        type: type || 'info',
        read: notification.read,
        createdAt: notification.createdAt
      });
    }

    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear notificación', error: error.message });
  }
};

// Obtener notificaciones de un usuario
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener notificaciones', error: error.message });
  }
};

// Marcar notificación como leída
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notification.findByIdAndUpdate(notificationId, { read: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al marcar como leída', error: error.message });
  }
};

// Marcar todas las notificaciones como leídas
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    await Notification.updateMany({ userId, read: false }, { read: true });
    res.status(200).json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al marcar todas como leídas', error: error.message });
  }
};

// Obtener el conteo de notificaciones no leídas
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.userId;
    const count = await Notification.countDocuments({ userId, read: false });
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener conteo', error: error.message });
  }
};

// Eliminar una notificación
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: userId
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    }

    res.status(200).json({ success: true, message: 'Notificación eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar notificación', error: error.message });
  }
};

/**
 * ===== FUNCIONES AUXILIARES PARA EMITIR NOTIFICACIONES =====
 * Usa estas funciones desde otros controladores para notificar automáticamente
 */

/**
 * Emitir notificación de cabaña aprobada
 * @param {Object} app - Express app (para obtener io)
 * @param {String} userId - ID del usuario a notificar
 * @param {String} cabanaName - Nombre de la cabaña
 */
exports.notificarCabanaAprobada = async (app, userId, cabanaName) => {
  try {
    const notification = await Notification.create({
      userId,
      title: '✅ Cabaña Aprobada',
      message: `Tu reserva de cabaña "${cabanaName}" ha sido aprobada.`,
      icon: '🏠',
      read: false
    });

    const io = app.get('io');
    if (io && userId) {
      io.to(`user_${userId}`).emit('nueva-notificacion', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        type: 'success',
        createdAt: notification.createdAt
      });
    }
    return notification;
  } catch (error) {
    console.error('Error notificando cabaña aprobada:', error);
  }
};

/**
 * Emitir notificación de cabaña rechazada
 */
exports.notificarCabanaRechazada = async (app, userId, cabanaName, motivo) => {
  try {
    const notification = await Notification.create({
      userId,
      title: '❌ Cabaña Rechazada',
      message: `Tu reserva de cabaña "${cabanaName}" ha sido rechazada. Motivo: ${motivo || 'Sin especificar'}`,
      icon: '🏠',
      read: false
    });

    const io = app.get('io');
    if (io && userId) {
      io.to(`user_${userId}`).emit('nueva-notificacion', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        type: 'error',
        createdAt: notification.createdAt
      });
    }
    return notification;
  } catch (error) {
    console.error('Error notificando cabaña rechazada:', error);
  }
};

/**
 * Emitir notificación de solicitud aprobada
 */
exports.notificarSolicitudAprobada = async (app, userId, solicitudTipo) => {
  try {
    const notification = await Notification.create({
      userId,
      title: '✅ Solicitud Aprobada',
      message: `Tu solicitud de ${solicitudTipo} ha sido aprobada.`,
      icon: '📄',
      read: false
    });

    const io = app.get('io');
    if (io && userId) {
      io.to(`user_${userId}`).emit('nueva-notificacion', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        type: 'success',
        createdAt: notification.createdAt
      });
    }
    return notification;
  } catch (error) {
    console.error('Error notificando solicitud aprobada:', error);
  }
};

/**
 * Emitir notificación de solicitud rechazada
 */
exports.notificarSolicitudRechazada = async (app, userId, solicitudTipo, motivo) => {
  try {
    const notification = await Notification.create({
      userId,
      title: '❌ Solicitud Rechazada',
      message: `Tu solicitud de ${solicitudTipo} ha sido rechazada. Motivo: ${motivo || 'Sin especificar'}`,
      icon: '📄',
      read: false
    });

    const io = app.get('io');
    if (io && userId) {
      io.to(`user_${userId}`).emit('nueva-notificacion', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        type: 'error',
        createdAt: notification.createdAt
      });
    }
    return notification;
  } catch (error) {
    console.error('Error notificando solicitud rechazada:', error);
  }
};

/**
 * Emitir notificación de tarea asignada
 */
exports.notificarTareaAsignada = async (app, userId, tareaTitulo, fechaVencimiento) => {
  try {
    const fechaFormato = new Date(fechaVencimiento).toLocaleDateString('es-ES');
    const notification = await Notification.create({
      userId,
      title: '📋 Nueva Tarea Asignada',
      message: `Se te ha asignado la tarea: "${tareaTitulo}". Vencimiento: ${fechaFormato}`,
      icon: '☑️',
      read: false
    });

    const io = app.get('io');
    if (io && userId) {
      io.to(`user_${userId}`).emit('nueva-notificacion', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        type: 'info',
        createdAt: notification.createdAt
      });
    }
    return notification;
  } catch (error) {
    console.error('Error notificando tarea asignada:', error);
  }
};
