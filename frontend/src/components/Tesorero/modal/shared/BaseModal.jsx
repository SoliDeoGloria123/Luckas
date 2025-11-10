import React from 'react';
import PropTypes from 'prop-types';

const BaseModal = ({ 
  title, 
  onClose, 
  children, 
  size = 'medium',
  className = '' 
}) => {
  return (
    <div className="modal-overlay-tesorero">
      <div className={`tesorero-modal ${size} ${className}`}>
        <div className="modal-header-tesorero">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body-tesorero">
          {children}
        </div>
      </div>
    </div>
  );
};

BaseModal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string
};

export default BaseModal;