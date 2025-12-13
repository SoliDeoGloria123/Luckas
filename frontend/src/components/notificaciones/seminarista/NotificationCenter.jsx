import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import notificationService from '../../../services/notificationService';
import './NotificationCenter.css';

const NotificationCenter = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const getToken = () => localStorage.getItem('token');

  // Cargar notificaciones
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const token = getToken();
        if (!token || !userId) return;

        const [notifs, count] = await Promise.all([
          notificationService.getNotifications(token),
          notificationService.getUnreadCount(token)
        ]);

        setNotifications(notifs);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    };

    loadNotifications();
  }, [userId]);

  // Cerrar panel al hacer clic fuera
  useEffect(() => {
    if (!isPanelOpen) return;

    const handleClickOutside = (event) => {
      // Verificar si el clic fue en el botón o sus elementos internos
      if (buttonRef.current?.contains(event.target)) {
        return;
      }
      
      // Verificar si el clic fue dentro del panel
      if (panelRef.current?.contains(event.target)) {
        return;
      }
      
      // Clic fuera → cerrar panel
      setIsPanelOpen(false);
    };

    // Usar mousedown para detectar clics fuera
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen]);

  const handleTogglePanel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Calcular posición del panel basado en el botón
    if (!isPanelOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const rightPos = Math.max(16, window.innerWidth - rect.right);
      setPanelPosition({
        top: rect.bottom + 10,
        right: rightPos
      });
    }
    
    setIsPanelOpen(prev => !prev);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = getToken();
      if (!token) return;

      await notificationService.markAsRead(notificationId, token);

      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = getToken();
      if (!token) return;

      await notificationService.markAllAsRead(token);

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const token = getToken();
      if (!token) return;

      await notificationService.deleteNotification(notificationId, token);

      setNotifications(prev => {
        const deletedNotif = prev.find(n => n._id === notificationId);
        if (deletedNotif && !deletedNotif.read) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev.filter(notif => notif._id !== notificationId);
      });
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Botón de notificación */}
      <button
        ref={buttonRef}
        data-notification-toggle
        className="notification-button"
        onMouseDown={handleTogglePanel}
        aria-label="Notificaciones"
        type="button"
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {/* Panel de notificaciones */}
      {isPanelOpen && (
        <div
          ref={panelRef}
          data-notification-panel
          className="notification-panel-seminarista"
          style={{
            top: `${panelPosition.top}px`,
            right: `${panelPosition.right}px`
          }}
        >
          <div className="notification-header">
            <h3>Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read"
                onClick={markAllAsRead}
                title="Marcar todas como leídas"
              >
                Marcar todo como leído
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <i className="fas fa-inbox"></i>
                <p>Sin notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                >
                  <button
                    type="button"
                    className="notification-content-btn"
                    onClick={() => handleNotificationClick(notification)}
                    aria-label={`${notification.title}: ${notification.message}`}
                  >
                    <div className="notification-icon">
                      <i className={`fas fa-${notification.icon || 'info-circle'}`}></i>
                    </div>
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="delete-notification"
                    onClick={(e) => handleDeleteNotification(e, notification._id)}
                    aria-label="Eliminar notificación"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

NotificationCenter.propTypes = {
  userId: PropTypes.string,
};
