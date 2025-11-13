import React from 'react';
import PropTypes from 'prop-types';

const ModalHeader = ({ title, onClose }) => {
  return (
    <div
      className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin"
      style={{
        background: 'linear-gradient(90deg, var(--color-blue-principal), var(--color-blue-oscuro))',
        color: 'white'
      }}
    >
      <h2>{title}</h2>
      <button className="modal-cerrar" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

ModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ModalHeader;