import React from 'react';
import PropTypes from 'prop-types';
import './NotificationPanel.css';
import useNotifications from '../../hooks/useNotifications';
import BaseNotificationPanel from '../../shared/BaseNotificationPanel';
import createNotificationCssClasses from '../../shared/notificationCss';

const NotificationPanel = ({ token, userRole, isOpen, onClose }) => {
  // Usar las clases centralizadas (evita duplicación)
  const dashboardCssClasses = createNotificationCssClasses();

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