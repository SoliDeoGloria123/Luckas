import React from 'react';

const UserMenu = ({ user, isOpen, onToggle, onLogout, onModificarPerfil }) => {
  return (
    <div className="usuario-container">
      <div className="usuario-info" onClick={onToggle}>
        <div className="usuario-avatar">
          <span className="avatar-letra">
            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="usuario-datos">
          <span className="usuario-nombre">{user?.nombre || 'Usuario'}</span>
          <span className="usuario-rol">Seminarista</span>
        </div>
        <div className="usuario-chevron">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="usuario-menu">
          <div className="usuario-menu-header">
            <div className="usuario-menu-avatar">
              <span className="avatar-letra-grande">
                {user?.nombre?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="usuario-menu-info">
              <h4>{user?.nombre || 'Usuario'}</h4>
              <p>Rol: Seminarista</p>
              <p className="email">{user?.email || 'email@ejemplo.com'}</p>
            </div>
          </div>
          <div className="usuario-menu-divider"></div>
          <ul className="usuario-menu-lista">
            <li onClick={onModificarPerfil}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Modificar Perfil
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
              </svg>
              Configuración
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Ayuda
            </li>
          </ul>
          <div className="usuario-menu-divider"></div>
          <div className="usuario-menu-footer">
            <button className="logout-btn" onClick={onLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
