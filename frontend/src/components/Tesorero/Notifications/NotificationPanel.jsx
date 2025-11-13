import React from 'react';
import PropTypes from 'prop-types';
import './NotificationPanel.css';
import useNotifications from '../../hooks/useNotifications';
import BaseNotificationPanel from '../../shared/BaseNotificationPanel';

const NotificationPanel = ({ token, userRole, isOpen, onClose }) => {
  // Configuración de clases CSS específicas para tesorero
  const tesoreroCssClasses = {
    panel: 'notification-panel-tesorero',
    header: 'notification-header-tesorero',
    title: 'notification-title-tesorero',
    titleText: 'title-tesorero',
    unreadCount: 'unread-count-tesorero',
    actions: 'notification-actions-tesorero',
    markAllBtn: 'mark-all-read-btn-tesorero',
    closeBtn: 'close-btn-tesorero',
    content: 'notification-content-tesorero',
    footer: 'notification-footer-tesorero',
    refreshBtn: 'refresh-btn-tesorero',
    loading: 'notification-loading-tesorero',
    spinner: 'spinner-tesorero',
    error: 'notification-error-tesorero',
    retryBtn: 'retry-btn-tesorero',
    empty: 'notification-empty-tesorero',
    emptyIcon: 'empty-icon-tesorero',
    list: 'notification-list-tesorero',
    item: 'notification-item-tesorero',
    iconItem: 'notification-icon-item-tesorero',
    contentItem: 'notification-content-item-tesorero',
    titleItem: 'notification-title-item-tesorero',
    message: 'notification-message-tesorero',
    date: 'notification-date-tesorero',
    actionsItem: 'notification-actions-item-tesorero',
    markReadBtn: 'mark-read-btn-tesorero',
    deleteBtn: 'delete-btn-tesorero'
  };

  return (
    <BaseNotificationPanel 
      token={token}
      userRole={userRole}
      isOpen={isOpen}
      onClose={onClose}
      useNotifications={useNotifications}
      cssClasses={tesoreroCssClasses}
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