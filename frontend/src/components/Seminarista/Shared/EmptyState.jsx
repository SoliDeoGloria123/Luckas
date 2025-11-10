import React from 'react';
import PropTypes from 'prop-types';

const EmptyState = ({ 
  title, 
  subtitle, 
  icon = "https://cdn-icons-png.flaticon.com/512/4076/4076549.png",
  iconAlt = "Sin datos"
}) => {
  return (
    <div className='no-data-container-misinscripciones'>
      <img 
        src={icon} 
        alt={iconAlt} 
        style={{width: '120px', marginBottom: '20px', opacity: 0.7}} 
      />
      <div>{title}</div>
      <div style={{fontSize: '0.95em', color: '#888', marginTop: '8px'}}>
        {subtitle}
      </div>
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.string,
  iconAlt: PropTypes.string
};

export default EmptyState;