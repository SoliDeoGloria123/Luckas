const Notification = require('../models/Notification');

// Crear una notificación para un usuario
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, icon } = req.body;
    const notification = new Notification({ userId, title, message, icon });
    await notification.save();
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
