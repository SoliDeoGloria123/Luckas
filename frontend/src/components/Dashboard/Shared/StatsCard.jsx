import React from 'react';
import PropTypes from 'prop-types';

const StatsCard = ({ icon, value, label, type = 'default' }) => {
  return (
    <div className="stat-card-reporte-admin">
      <div className={`stat-icon-reporte-admin-admin ${type}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stat-info-admin">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string
};

export default StatsCard;