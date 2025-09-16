import React from 'react';
import './PremiumHeader.css';

const PremiumHeader = ({ 
  user, 
  darkMode, 
  onToggleDarkMode, 
  onAvatarClick, 
  onLogout,
  className = '' 
}) => {
  return (
    <header className={`premium-header ${className}`}>
      {/* Logo */}
      <div className="premium-logo">
        <div className="logo-icon">
          <span className="logo-text">L</span>
        </div>
        <span className="brand-name">Luckas</span>
      </div>

      {/* Navegación Central */}
      <nav className="premium-nav">
        <a href="#cursos" className="nav-link">
          <span className="nav-icon">📚</span>
          Cursos
        </a>
        <a href="#eventos" className="nav-link">
          <span className="nav-icon">🎯</span>
          Eventos
        </a>
        <a href="#nosotros" className="nav-link">
          <span className="nav-icon">ℹ️</span>
          Nosotros
        </a>
      </nav>

      {/* Acciones del Usuario */}
      <div className="premium-actions">
        {/* Toggle Dark Mode */}
        <button 
          onClick={onToggleDarkMode} 
          className="action-button dark-mode-toggle"
          aria-label="Cambiar tema"
        >
          <span className="toggle-icon">
            {darkMode ? '☀️' : '🌙'}
          </span>
        </button>

        {/* Avatar Usuario */}
        {user && (
          <div className="user-section" onClick={onAvatarClick}>
            <div className="user-avatar">
              {user.fotoPerfil ? (
                <img 
                  src={user.fotoPerfil} 
                  alt="Perfil" 
                  className="avatar-image" 
                />
              ) : (
                <div className="avatar-placeholder">
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">
                {user.nombre || 'Usuario'}
              </span>
              <span className="user-role">Externo</span>
            </div>
          </div>
        )}

        {/* Botón de Acción Principal */}
        <button className="action-button cta-button" onClick={onLogout}>
          <span className="button-text">Salir</span>
          <span className="button-icon">🚪</span>
        </button>
      </div>
    </header>
  );
};

export default PremiumHeader;
