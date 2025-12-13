const Notification = require('../models/Notification');

/**
 * Crear notificación y emitir por Socket.IO
 * @param {Object} io - Socket.IO instance
 * @param {String} userId - ID del usuario que recibe la notificación
 * @param {Object} notificationData - {title, message, icon, type}
 */
exports.sendNotification = async (io, userId, notificationData) => {
  try {
    if (!userId) {
      console.warn('⚠️ userId no proporcionado para notificación');
      return;
    }

    const { title, message, icon = 'info-circle', type = 'info' } = notificationData;

    // Crear en base de datos
    const notification = new Notification({
      userId,
      title,
      message,
      icon,
      type,
    });

    await notification.save();

    // Emitir por Socket.IO en tiempo real
    if (io) {
      io.to(`user_${userId}`).emit('nueva-notificacion', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        type: notification.type || 'info',
        read: notification.read,
        createdAt: notification.createdAt,
      });

      console.log(`✅ Notificación enviada a user_${userId}`);
    }

    return notification;
  } catch (error) {
    console.error('❌ Error al enviar notificación:', error);
  }
};

/**
 * Notificar cuando se aprueba una cabaña
 */
exports.notifyCanbaApproved = async (io, userId, cabanaName) => {
  return exports.sendNotification(io, userId, {
    title: '✅ Cabaña Aprobada',
    message: `Tu solicitud de cabaña "${cabanaName}" ha sido aprobada.`,
    icon: 'check-circle',
    type: 'success',
  });
};

/**
 * Notificar cuando se rechaza una cabaña
 */
exports.notifyCabanaRejected = async (io, userId, cabanaName) => {
  return exports.sendNotification(io, userId, {
    title: '❌ Cabaña Rechazada',
    message: `Tu solicitud de cabaña "${cabanaName}" ha sido rechazada.`,
    icon: 'times-circle',
    type: 'error',
  });
};

/**
 * Notificar cuando se aprueba una solicitud
 */
exports.notifySolicitudApproved = async (io, userId, solicitudType) => {
  return exports.sendNotification(io, userId, {
    title: '✅ Solicitud Aprobada',
    message: `Tu solicitud de ${solicitudType} ha sido aprobada.`,
    icon: 'check-circle',
    type: 'success',
  });
};

/**
 * Notificar cuando se rechaza una solicitud
 */
exports.notifySolicitudRejected = async (io, userId, solicitudType) => {
  return exports.sendNotification(io, userId, {
    title: '❌ Solicitud Rechazada',
    message: `Tu solicitud de ${solicitudType} ha sido rechazada.`,
    icon: 'times-circle',
    type: 'error',
  });
};

/**
 * Notificar cuando se asigna una tarea
 */
exports.notifyTaskAssigned = async (io, userId, taskTitle) => {
  return exports.sendNotification(io, userId, {
    title: '📋 Nueva Tarea Asignada',
    message: `Se te ha asignado la tarea: "${taskTitle}"`,
    icon: 'tasks',
    type: 'info',
  });
};
