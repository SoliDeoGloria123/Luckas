import React from 'react';
import PropTypes from 'prop-types';
import BaseNotificationButton from '../../Tesorero/shared/BaseNotificationButton';
import NotificationPanel from './NotificationPanel';
import useNotifications from '../../hooks/useNotifications';
import './NotificationButton.css';

const NotificationButton = ({ token, userRole }) => {
  const dashboardCssClasses = {
    container: 'notification-button-container',
    button: 'notification-button',
    icon: 'notification-icon',
    badge: 'notification-badge'
  };

  return (
    <BaseNotificationButton
      token={token}
      userRole={userRole}
      NotificationPanelComponent={NotificationPanel}
      cssClasses={dashboardCssClasses}
      useNotificationsHook={useNotifications}
    />
  );
};

NotificationButton.propTypes = {
  token: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default NotificationButton;