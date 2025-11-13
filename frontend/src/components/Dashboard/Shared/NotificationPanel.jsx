import React from 'react';
import PropTypes from 'prop-types';
import './NotificationPanel.css';
import useNotifications from '../../hooks/useNotifications';
import BaseNotificationPanel from '../../shared/BaseNotificationPanel';

const NotificationPanel = ({ token, userRole, isOpen, onClose }) => {
  // Configuración de clases CSS específicas para Dashboard
  const dashboardCssClasses = {
    loading: 'notification-loading',
    spinner: 'spinner',
    error: 'notification-error',
    retryBtn: 'retry-btn',
    empty: 'notification-empty',
    emptyIcon: 'empty-icon',
    list: 'notification-list',
    item: 'notification-item',
    iconItem: 'notification-icon',
    contentItem: 'notification-content-item',
    titleItem: 'notification-title-item',
    message: 'notification-message',
    date: 'notification-date',
    actionsItem: 'notification-actions-item',
    markReadBtn: 'mark-read-btn',
    deleteBtn: 'delete-btn'
  };

  return (
    <BaseNotificationPanel 
      token={token}
      userRole={userRole}
      isOpen={isOpen}
      onClose={onClose}
      useNotifications={useNotifications}
      cssClasses={dashboardCssClasses}
    />
  );
};



NotificationPanel.propTypes = {
  token: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationPanel;