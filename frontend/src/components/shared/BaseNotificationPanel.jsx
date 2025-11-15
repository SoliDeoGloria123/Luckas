import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import createNotificationCssClasses from './notificationCss';

const BaseNotificationPanel = ({ 
  token, 
  userRole, 
  isOpen, 
  onClose, 
  useNotifications,
  cssClasses = {}
}) => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications(token, userRole);

  // Configuración por defecto de clases CSS (centralizada)
  const defaultClasses = createNotificationCssClasses();

  // Fusionar clases CSS personalizadas con las por defecto
  const classes = { ...defaultClasses, ...cssClasses };

  // Mapeo de íconos
  const getNotificationIcon = (icon) => {
    const iconMap = {
      'UserPlus': '👤', 'Calendar': '📅', 'FileText': '📄', 'Bell': '🔔',
      'Info': 'ℹ️', 'Warning': '⚠️', 'Error': '❌', 'Success': '✅'
    };
    return iconMap[icon] || '🔔';
  };

  // Formateo de fecha
  const formatDate = (date) => new Date(date).toLocaleString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Manejar tecla Escape
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  // Estados de renderizado
  const renderLoadingState = () => (
    <div className={classes.loading}>
      <div className={classes.spinner}></div>
      <p>Cargando notificaciones...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className={classes.error}>
      <p>{error}</p>
      <button onClick={fetchNotifications} className={classes.retryBtn}>
        Reintentar
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <div className={classes.empty}>
      <div className={classes.emptyIcon}>🔔</div>
      <p>No hay notificaciones</p>
    </div>
  );

  const renderNotificationItem = (notification) => (
    <div 
      key={notification._id}
      className={`${classes.item} ${notification.read ? 'read' : 'unread'}`}
    >
      <div className={classes.iconItem}>
        {getNotificationIcon(notification.icon)}
      </div>
      
      <div className={classes.contentItem}>
        <div className={classes.titleItem}>
          {notification.title}
        </div>
        <div className={classes.message}>
          {notification.message}
        </div>
        <div className={classes.date}>
          {formatDate(notification.createdAt)}
        </div>
      </div>

      <div className={classes.actionsItem}>
        {!notification.read && (
          <button 
            onClick={() => markAsRead(notification._id)}
            className={classes.markReadBtn}
            title="Marcar como leída"
          >
            👁️
          </button>
        )}
        <button 
          onClick={() => deleteNotification(notification._id)}
          className={classes.deleteBtn}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    if (notifications.length === 0) return renderEmptyState();
    
    return (
      <div className={classes.list}>
        {notifications.map(renderNotificationItem)}
      </div>
    );
  };

  // Effects
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, fetchNotifications]);

  if (!['admin', 'tesorero'].includes(userRole)) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <button
          className={classes.overlay} 
          onClick={onClose}
          onKeyDown={handleKeyDown}
          aria-label="Cerrar panel de notificaciones"
          type="button"
        />
      )}

      {/* Panel de notificaciones */}
      <div className={`${classes.panel} ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className={classes.header}>
          <div className={classes.title}>
            <span className={classes.titleText}>Notificaciones</span>
            {unreadCount > 0 && (
              <span className={classes.unreadCount}>{unreadCount}</span>
            )}
          </div>
          
          <div className={classes.actions}>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className={classes.markAllBtn}
                title="Marcar todas como leídas"
              >
                ✓
              </button>
            )}
            <button 
              onClick={onClose}
              className={classes.closeBtn}
              title="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={classes.content}>
          {renderContent()}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className={classes.footer}>
            <button 
              onClick={fetchNotifications} 
              className={classes.refreshBtn}
            >
              🔄 Actualizar
            </button>
          </div>
        )}
      </div>
    </>
  );
};

BaseNotificationPanel.propTypes = {
  token: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  useNotifications: PropTypes.func.isRequired,
  cssClasses: PropTypes.object
};

export default BaseNotificationPanel;