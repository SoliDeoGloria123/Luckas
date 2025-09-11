import React, { useState } from 'react';
import { authService } from '../../services/authService';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: email, 2: token+password
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.forgotPassword(email);
      setSuccessMessage(response.message);
      
      // Si el response incluye el token (solo para testing)
      if (response.resetToken) {
        setToken(response.resetToken);
        setSuccessMessage(`Token generado: ${response.resetToken}`);
      }
      
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, newPassword);
      setSuccessMessage('Contraseña actualizada exitosamente');
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al resetear contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail('');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccessMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="forgot-password-overlay">
      <div className="forgot-password-modal">
        <div className="modal-header">
          <h3>
            {step === 1 ? '🔐 Recuperar Contraseña' : '🔑 Nueva Contraseña'}
          </h3>
          <button className="close-btn" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {step === 1 ? (
            <form onSubmit={handleEmailSubmit}>
              <p className="instruction">
                Ingresa tu correo electrónico y te enviaremos un token para resetear tu contraseña.
              </p>
              
              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <div className="input-group">
                  <span className="input-icon">
                    <i className="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu-email@seminario.edu.co"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  {successMessage}
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Enviar Token
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetSubmit}>
              <p className="instruction">
                Ingresa el token recibido y tu nueva contraseña.
              </p>

              <div className="form-group">
                <label htmlFor="token">Token de Recuperación</label>
                <div className="input-group">
                  <span className="input-icon">
                    <i className="fas fa-key"></i>
                  </span>
                  <input
                    type="text"
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Pega aquí tu token de recuperación"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <div className="input-group">
                  <span className="input-icon">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <div className="input-group">
                  <span className="input-icon">
                    <i className="fas fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu nueva contraseña"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  {successMessage}
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  <i className="fas fa-arrow-left"></i>
                  Volver
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i>
                      Actualizar Contraseña
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
