import React from 'react';
import PropTypes from 'prop-types';
import BaseNotificationButton from '../shared/BaseNotificationButton';
import NotificationPanel from './NotificationPanel';
import useNotifications from '../../hooks/useNotifications';
import './NotificationButton.css';

const NotificationButton = ({ token, userRole }) => {
  const tesoreroCssClasses = {
    container: 'notification-button-container',
    button: 'notification-button-tesorero',
    icon: 'notification-icon-tesorero',
    badge: 'notification-badge-tesorero'
  };

  return (
    <BaseNotificationButton
      token={token}
      userRole={userRole}
      NotificationPanelComponent={NotificationPanel}
      cssClasses={tesoreroCssClasses}
      useNotificationsHook={useNotifications}
    />
  );
};

NotificationButton.propTypes = {
  token: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default NotificationButton;