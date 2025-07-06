import React from 'react';

const StatsCard = ({ title, value, icon, color = 'primary', trend, description }) => {
  const getColorClass = () => {
    switch (color) {
      case 'success': return 'stats-card-success';
      case 'warning': return 'stats-card-warning';
      case 'danger': return 'stats-card-danger';
      case 'info': return 'stats-card-info';
      default: return 'stats-card-primary';
    }
  };

  return (
    <div className={`stats-card ${getColorClass()}`}>
      <div className="stats-card-content">
        <div className="stats-card-header">
          <div className="stats-card-icon">
            {icon}
          </div>
          {trend && (
            <div className={`stats-card-trend ${trend.direction === 'up' ? 'trend-up' : 'trend-down'}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {trend.direction === 'up' ? (
                  <path d="M7 17l5-5 5 5M12 19V7"/>
                ) : (
                  <path d="M17 7l-5 5-5-5M12 5v12"/>
                )}
              </svg>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className="stats-card-body">
          <h3 className="stats-card-value">{value}</h3>
          <p className="stats-card-title">{title}</p>
          {description && (
            <p className="stats-card-description">{description}</p>
          )}
        </div>
      </div>
      <div className="stats-card-glow"></div>
    </div>
  );
};

export default StatsCard;
