import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const BaseNotificationButton = ({ 
  token, 
  userRole, 
  NotificationPanelComponent,
  cssClasses = {
    container: 'notification-button-container',
    button: 'notification-button',
    icon: 'notification-icon',
    badge: 'notification-badge'
  },
  useNotificationsHook
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, fetchUnreadCount } = useNotificationsHook(token, userRole);

  // Abrir/cerrar panel (comportamiento tipo Facebook)
  const togglePanel = () => {
    setIsOpen(prev => !prev);
  };

  // Cerrar panel y refrescar conteo
  const handlePanelClose = () => {
    setIsOpen(false);
    fetchUnreadCount();
  };

  useEffect(() => {
    fetchUnreadCount();

    // Auto-refresh cada minuto
    const interval = setInterval(() => {
      if (!isOpen) { // Solo si el panel está cerrado
        fetchUnreadCount();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [token, userRole, isOpen, fetchUnreadCount]);

  // No mostrar si no es admin o tesorero
  if (!['admin', 'tesorero'].includes(userRole)) {
    return null;
  }

  // Generar aria-label
  const getAriaLabel = () => {
    if (unreadCount > 0) {
      return `Notificaciones (${unreadCount} sin leer)`;
    }
    return 'Notificaciones';
  };

  return (
    <div className={cssClasses.container}>
      <button 
        onClick={togglePanel}
        className={`${cssClasses.button} ${isOpen ? 'active' : ''}`}
        title="Notificaciones"
        aria-label={getAriaLabel()}
        type="button"
      >
        <div className={cssClasses.icon}>🔔</div>
        {unreadCount > 0 && !isOpen && (
          <div className={cssClasses.badge}>{unreadCount > 99 ? '99+' : unreadCount}</div>
        )}
      </button>

      <NotificationPanelComponent 
        token={token}
        userRole={userRole}
        isOpen={isOpen}
        onClose={handlePanelClose}
      />
    </div>
  );
};

BaseNotificationButton.propTypes = {
  token: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  NotificationPanelComponent: PropTypes.elementType.isRequired,
  cssClasses: PropTypes.shape({
    container: PropTypes.string,
    button: PropTypes.string,
    icon: PropTypes.string,
    badge: PropTypes.string
  }),
  useNotificationsHook: PropTypes.func.isRequired
};

export default BaseNotificationButton;