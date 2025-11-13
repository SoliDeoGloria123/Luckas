import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import NotificationPanel from './NotificationPanel';
import notificationService from '../../../services/notificationService';
import './NotificationButton.css';

const NotificationButton = ({ token, userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Obtener conteo de notificaciones no leídas
  const fetchUnreadCount = async () => {
    if (!token || !['admin', 'tesorero'].includes(userRole)) return;

    try {
      const count = await notificationService.getUnreadCount(token);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error al obtener conteo de notificaciones:', error);
    }
  };

  // Abrir/cerrar panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Cerrar panel
  const closePanel = () => {
    setIsOpen(false);
  };

  // Actualizar conteo cuando se cierre el panel
  const handlePanelClose = () => {
    closePanel();
    fetchUnreadCount(); // Refrescar conteo
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
  }, [token, userRole, isOpen]);

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
    <>
      <div className="notification-button-container">
        <button 
          onClick={togglePanel}
          className={`notification-button ${isOpen ? 'active' : ''}`}
          title="Notificaciones"
          aria-label={getAriaLabel()}
        >
          <div className="notification-icon">
            🔔
          </div>
          {unreadCount > 0 && (
            <div className="notification-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </button>
      </div>

      <NotificationPanel 
        token={token}
        userRole={userRole}
        isOpen={isOpen}
        onClose={handlePanelClose}
      />
    </>
  );
};

NotificationButton.propTypes = {
  token: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default NotificationButton;