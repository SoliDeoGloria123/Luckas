import { useState, useCallback } from 'react';
import notificationService from '../../services/notificationService';

export default function useNotifications(token, userRole) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canAccess = !!token && ['admin', 'tesorero'].includes(userRole);

  const fetchUnreadCount = useCallback(async () => {
    if (!canAccess) return;
    try {
      const count = await notificationService.getUnreadCount(token);
      setUnreadCount(count || 0);
    } catch (err) {
      console.error('useNotifications: fetchUnreadCount error', err);
    }
  }, [token, canAccess]);

  const fetchNotifications = useCallback(async () => {
    if (!canAccess) return;
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications(token);
      setNotifications(data || []);
      const count = (data?.filter(n => !n.read).length) || 0;
      setUnreadCount(count);
    } catch (err) {
      console.error('useNotifications: fetchNotifications error', err);
      setError('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  }, [token, canAccess]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!canAccess) return;
    try {
      await notificationService.markNotificationAsRead(notificationId, token);
      setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('useNotifications: markAsRead error', err);
    }
  }, [token, canAccess]);

  const markAllAsRead = useCallback(async () => {
    if (!canAccess) return;
    try {
      await notificationService.markAllNotificationsAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('useNotifications: markAllAsRead error', err);
    }
  }, [token, canAccess]);

  const deleteNotification = useCallback(async (notificationId) => {
    if (!canAccess) return;
    try {
      await notificationService.deleteNotification(notificationId, token);
      let deletedUnread = false;
      setNotifications(prev => {
        const toDelete = prev.find(n => n._id === notificationId);
        if (toDelete && !toDelete.read) deletedUnread = true;
        return prev.filter(n => n._id !== notificationId);
      });
      if (deletedUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('useNotifications: deleteNotification error', err);
    }
  }, [token, canAccess]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchUnreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
}
