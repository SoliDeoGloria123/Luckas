import React from 'react';
import PropTypes from 'prop-types';

const ModalFooter = ({ isSubmitting, onClose, getButtonText }) => (
  <div className="modal-action-admin">
    <button className="btn-admin secondary-admin" type="button" onClick={onClose} disabled={isSubmitting}>
      <i className="fas fa-times"></i> {' '}
      Cancelar
    </button>
    <button className="btn-admin btn-primary" type="submit" disabled={isSubmitting}>
      <i className="fas fa-save"></i>
      {getButtonText()}
    </button>
  </div>
);

ModalFooter.propTypes = {
  isSubmitting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getButtonText: PropTypes.func.isRequired,
};

export default ModalFooter;
