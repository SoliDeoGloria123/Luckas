import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as notificationService from '../../../services/notificationService';
import './NotificationPanel.css';

const NotificationPanel = ({ token, userRole, isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener notificaciones
  const fetchNotifications = async () => {
    if (!token || !['admin', 'tesorero'].includes(userRole)) return;

    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications(token);
      setNotifications(data || []);
      
      // Contar no leídas
      const unreadCount = data?.filter(notif => !notif.read).length || 0;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      setError('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  // Marcar como leída
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markNotificationAsRead(notificationId, token);
      
      // Actualizar estado local
      setNotifications(notifications.map(notif => 
        notif._id === notificationId 
          ? { ...notif, read: true }
          : notif
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllNotificationsAsRead(token);
      
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  // Eliminar notificación
  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId, token);
      
      const deletedNotification = notifications.find(notif => notif._id === notificationId);
      setNotifications(notifications.filter(notif => notif._id !== notificationId));
      
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  // Manejar tecla Escape
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  // Obtener ícono según el tipo
  const getNotificationIcon = (icon) => {
    const iconMap = {
      'UserPlus': '👤',
      'Calendar': '📅',
      'FileText': '📄',
      'Bell': '🔔',
      'Info': 'ℹ️',
      'Warning': '⚠️',
      'Error': '❌',
      'Success': '✅'
    };
    return iconMap[icon] || '🔔';
  };

  // Formatear fecha
  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderizar contenido principal
  const renderContent = () => {
    if (loading) {
      return (
        <div className="notification-loading-tesorero">
          <div className="spinner-tesorero"></div>
          <p>Cargando notificaciones...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="notification-error-tesorero">
          <p>{error}</p>
          <button onClick={fetchNotifications} className="retry-btn-tesorero">
            Reintentar
          </button>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="notification-empty-tesorero">
          <div className="empty-icon-tesorero">🔔</div>
          <p>No hay notificaciones</p>
        </div>
      );
    }

    return (
      <div className="notification-list-tesorero">
        {notifications.map((notification) => (
          <div 
            key={notification._id}
            className={`notification-item-tesorero ${notification.read ? 'read' : 'unread'}`}
          >
            <div className="notification-icon-item-tesorero">
              {getNotificationIcon(notification.icon)}
            </div>
            
            <div className="notification-content-item-tesorero">
              <div className="notification-title-item-tesorero">
                {notification.title}
              </div>
              <div className="notification-message-tesorero">
                {notification.message}
              </div>
              <div className="notification-date-tesorero">
                {formatDate(notification.createdAt)}
              </div>
            </div>

            <div className="notification-actions-item-tesorero">
              {!notification.read && (
                <button 
                  onClick={() => markAsRead(notification._id)}
                  className="mark-read-btn-tesorero"
                  title="Marcar como leída"
                >
                  👁️
                </button>
              )}
              <button 
                onClick={() => deleteNotification(notification._id)}
                className="delete-btn-tesorero"
                title="Eliminar"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, token, userRole]);

  // Auto-refresh cada 30 segundos si está abierto
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, token, userRole]);

  if (!['admin', 'tesorero'].includes(userRole)) {
    return null;
  }

  return (
    <>
      {/* Panel de notificaciones */}
      <div className={`notification-panel-tesorero ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="notification-header-tesorero">
          <div className="notification-title-tesorero">
            <span className="title-tesorero">Notificaciones</span>
            {unreadCount > 0 && (
              <span className="unread-count-tesorero">{unreadCount}</span>
            )}
          </div>
          
          <div className="notification-actions-tesorero">
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="mark-all-read-btn-tesorero"
                title="Marcar todas como leídas"
              >
                ✓
              </button>
            )}
            <button 
              onClick={onClose}
              className="close-btn-tesorero"
              title="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="notification-content-tesorero">
          {renderContent()}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="notification-footer-tesorero">
            <button 
              onClick={fetchNotifications} 
              className="refresh-btn-tesorero"
            >
              🔄 Actualizar
            </button>
          </div>
        )}
      </div>
    </>
  );
};

NotificationPanel.propTypes = {
  token: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationPanel;