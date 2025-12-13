/**
 * 🔔 Servicio Completo de Notificaciones
 * Centraliza todas las operaciones de notificaciones
 * Compatible con Socket.IO en tiempo real
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

/**
 * Obtener todas las notificaciones del usuario autenticado
 * @param {string} token - Token JWT
 * @returns {Promise<Array>} Lista de notificaciones
 */
export const getNotifications = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.notifications || [];
  } catch (error) {
    console.error('❌ Error al obtener notificaciones:', error);
    throw error;
  }
};

/**
 * Obtener el conteo de notificaciones no leídas
 * @param {string} token - Token JWT
 * @returns {Promise<number>} Cantidad de no leídas
 */
export const getUnreadCount = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/notifications/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.count || 0;
  } catch (error) {
    console.error('❌ Error al obtener conteo de no leídas:', error);
    throw error;
  }
};

/**
 * Marcar una notificación específica como leída
 * @param {string} notificationId - ID de la notificación
 * @param {string} token - Token JWT
 * @returns {Promise<void>}
 */
export const markAsRead = async (notificationId, token) => {
  try {
    await axios.put(`${API_URL}/api/notifications/read`, 
      { notificationId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('❌ Error al marcar como leída:', error);
    throw error;
  }
};

/**
 * Marcar TODAS las notificaciones como leídas
 * @param {string} token - Token JWT
 * @returns {Promise<void>}
 */
export const markAllAsRead = async (token) => {
  try {
    await axios.put(`${API_URL}/api/notifications/read-all`, 
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('❌ Error al marcar todas como leídas:', error);
    throw error;
  }
};

/**
 * Eliminar una notificación
 * @param {string} notificationId - ID de la notificación
 * @param {string} token - Token JWT
 * @returns {Promise<void>}
 */
export const deleteNotification = async (notificationId, token) => {
  try {
    await axios.delete(`${API_URL}/api/notifications/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('❌ Error al eliminar notificación:', error);
    throw error;
  }
};

/**
 * Crear una notificación (para admin/tesorero)
 * @param {Object} notificationData - {userId, title, message, icon, type}
 * @param {string} token - Token JWT
 * @returns {Promise<Object>} Notificación creada
 */
export const createNotification = async (notificationData, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/notifications`, 
      notificationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.notification;
  } catch (error) {
    console.error('❌ Error al crear notificación:', error);
    throw error;
  }
};

/**
 * Objeto con todos los métodos del servicio
 * Uso: notificationService.getNotifications(token)
 */
const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
};

export default notificationService;
