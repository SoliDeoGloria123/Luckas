// Servicio para notificaciones del sistema
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Obtener todas las notificaciones del usuario autenticado
export const getNotifications = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    
    return res.data.notifications;
  } catch (error) {
    console.error('❌ Error al obtener notificaciones:', error);
    throw error;
  }
};

// Obtener el conteo de notificaciones no leídas
export const getUnreadCount = async (token) => {
  try {

    const res = await axios.get(`${API_URL}/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data.count;
  } catch (error) {
    console.error('❌ Error al obtener conteo de no leídas:', error);
    throw error;
  }
};

// Marcar una notificación como leída
export const markNotificationAsRead = async (notificationId, token) => {
  try {
    await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    throw error;
  }
};

// Marcar todas las notificaciones como leídas
export const markAllNotificationsAsRead = async (token) => {
  try {
    await axios.put(`${API_URL}/read-all`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    throw error;
  }
};

// Eliminar una notificación
export const deleteNotification = async (notificationId, token) => {
  try {
    await axios.delete(`${API_URL}/notifications/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    throw error;
  }
};

// Crear notificación (para admin)
export const createNotification = async (data, token) => {
  try {
    const res = await axios.post(`${API_URL}/notifications`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.data.notification;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  }
};

const notificationService = {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createNotification
};

export default notificationService;
