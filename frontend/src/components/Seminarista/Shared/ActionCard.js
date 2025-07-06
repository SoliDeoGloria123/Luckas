import React from 'react';

const ActionCard = ({ title, description, icon, onClick, variant = 'primary', disabled = false }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary': return 'action-card-secondary';
      case 'success': return 'action-card-success';
      case 'warning': return 'action-card-warning';
      case 'danger': return 'action-card-danger';
      default: return 'action-card-primary';
    }
  };

  return (
    <div 
      className={`action-card ${getVariantClass()} ${disabled ? 'action-card-disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="action-card-content">
        <div className="action-card-icon">
          {icon}
        </div>
        <div className="action-card-body">
          <h3 className="action-card-title">{title}</h3>
          <p className="action-card-description">{description}</p>
        </div>
        <div className="action-card-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
      <div className="action-card-glow"></div>
    </div>
  );
};

export default ActionCard;
