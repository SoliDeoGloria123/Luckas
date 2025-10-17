// Servicio para notificaciones externas
import axios from 'axios';

const API_URL = '/api/notifications';

export const getNotifications = async (token) => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data.notifications;
};

export const markNotificationAsRead = async (notificationId, token) => {
  await axios.put(`${API_URL}/read`, { notificationId }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const createNotification = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data.notification;
};

const notificationService = {
  getNotifications,
  markNotificationAsRead,
  createNotification
};

export default notificationService;
