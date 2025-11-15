import React from 'react';
import PropTypes from 'prop-types';

const ModalWrapper = ({
  mostrar,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  submitIcon = null,
  maxWidthClass = 'max-w-4xl',
  formStyle = {}
}) => {
  if (!mostrar) return null;

  const handleSubmit = (e) => {
    if (onSubmit) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`glass-card rounded-2xl shadow-2xl border border-white/20 w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto bg-white`}>
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

        <form className="modal-body-admin" style={formStyle} onSubmit={handleSubmit}>
          {children}

          <div className="modal-action-admin">
            <button type="button" className="btn-admin secondary-admin" onClick={onClose}>
              <i className="fas fa-times"></i> {' '}
              {cancelLabel}
            </button>
            <button type="submit" className="btn-admin btn-primary">
              {submitIcon && <i className={submitIcon}></i>}{' '}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalWrapper.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  submitIcon: PropTypes.string,
  maxWidthClass: PropTypes.string,
  formStyle: PropTypes.object
};

export default ModalWrapper;
