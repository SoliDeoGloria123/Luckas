
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Header.css';



const Header = ({ user, breadcrumbPath, onTabChange }) => {
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [showGestionesDropdown, setShowGestionesDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const gestionesDropdownRef = useRef(null);


  // Efecto para cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuUsuarioAbierto && !event.target.closest('.usuario-container')) {
        setMenuUsuarioAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuUsuarioAbierto]);


  // Obtener usuario logueado desde localStorage
  const usuarioLogueado = (() => {
    try {
      const usuarioStorage = localStorage.getItem('usuario');
      return usuarioStorage ? JSON.parse(usuarioStorage) : null;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    globalThis.location.href = '/';
  };

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Abrir/cerrar al hacer click en el botón
  const toggleDropdown = () => {
    setShowUserDropdown((prev) => !prev);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        gestionesDropdownRef.current &&
        !gestionesDropdownRef.current.contains(event.target) &&
        !event.target.closest('.nav-item-seminario.mis-gestiones-btn')
      ) {
        setShowGestionesDropdown(false);
      }
      
      // Cerrar menú móvil al hacer clic fuera
      if (isMobileMenuOpen && !event.target.closest('.header-nav-seminario') && !event.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);
  return (
    <>
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'show' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsMobileMenuOpen(false);
        }}
        aria-hidden="true"
      />
      <header className="header-seminario">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
      <div className="header-container-seminario">
        <div className="header-left-seminario">
          <div className="logo-seminario">
            <span className="luckas-seminario">LUCKAS</span>
            <span className="role-badge-seminario">Seminario</span>
          </div>
        </div>

        <nav className={`header-nav-seminario ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <a
            href="/seminarista"
            className={`nav-item-seminario${globalThis.location.pathname === '/seminarista' ? ' active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="nav-icon-seminario">🏠</span>Inicio
          </a>
          <a
            href="/seminarista/tareas"
            className={`nav-item-seminario${globalThis.location.pathname === '/seminarista/tareas' ? ' active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="nav-icon-seminario">☑️</span>Tareas
          </a>
          <a
            href="/dashboard/seminarista/eventos"
            className={`nav-item-seminario${globalThis.location.pathname === '/dashboard/seminarista/eventos' ? ' active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="nav-icon-seminario">📅</span>Eventos
          </a>
          <a
            href="/dashboard/seminarista/cabanas"
            className={`nav-item-seminario${globalThis.location.pathname === '/dashboard/seminarista/cabanas' ? ' active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="nav-icon-seminario">🏠</span>Cabañas
          </a>
          <a
            href="/dashboard/seminarista/cursos"
            className={`nav-item-seminario${globalThis.location.pathname === '/dashboard/seminarista/cursos' ? ' active' : ''}`}
            onClick={handleNavClick}
          >
            <span className="nav-icon-seminario">📚</span>Cursos
          </a>
          <button
            type="button"
            className="nav-item-seminario mis-gestiones-btn"
            aria-haspopup="true"
            aria-expanded={showGestionesDropdown}
            onClick={() => setShowGestionesDropdown(prev => !prev)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowGestionesDropdown(prev => !prev); }}
          >
            <span className="nav-icon">📝</span> Mis Gestiones <span className="dropdown-arrow">▼</span>
          </button>
          <div
            ref={gestionesDropdownRef}
            className={`dropdown-menu-seminario${showGestionesDropdown ? ' show' : ''}`}
          >
            <div className="dropdown-container-seminario">
              <a href="/dashboard/seminarista/mis-inscripciones" className="dropdown-item-seminario" onClick={handleNavClick}> <span className="dropdown-icon">📋</span>Mis Inscripciones</a>
              <a href="/dashboard/seminarista/mis-reservas" className="dropdown-item-seminario" onClick={handleNavClick}>  <span className="dropdown-icon">🏠</span>Mis Reservas</a>
              <a href="/dashboard/seminarista/mis-solicitudes" className="dropdown-item-seminario" onClick={handleNavClick}> <span className="dropdown-icon">📄</span>Mis Solicitudes</a>
              <a href="/dashboard/seminarista/nueva-solicitud" className="dropdown-item-seminario" onClick={handleNavClick}><span className="dropdown-icon">📄</span>Nueva Solicitud</a>
            </div>
          </div>
        </nav>

        <div className="header-right-seminario">
          <button 
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            ☰
          </button>
          <div className="header-icons-seminario">
            <button className="icon-btn-seminario">
              <span className="notification-icon-seminario">🔔</span>
              <span className="notification-badge-seminario">3</span>
            </button>
          </div>
          <button 
            type="button"
            className="user-profile-seminario" 
            onClick={toggleDropdown}
            aria-expanded={showUserDropdown}
            aria-haspopup="true"
          >
            <span className="user-avatar-seminario">S</span>
            <div className="user-info-seminario">
              <span className="user-name-seminario">{usuarioLogueado && usuarioLogueado.nombre ? usuarioLogueado.nombre : 'Usuario'}</span>
              <span className="user-role-seminario">{usuarioLogueado?.role || "Rol"}</span>
            </div>
            <div className={`user-dropdown-header ${showUserDropdown ? "show" : ""}`}>
              <a href="/dashboard/seminarista/Mi-Perfil" className="dropdown-item">
                <span>Mi Perfil</span>
              </a>
              <a href="/dashboard/seminarista/Configuracion" className="dropdown-item">
                <span>Configuración</span>
              </a>
              <hr className="dropdown-divider" />
              <button type="button" className="dropdown-item" onClick={handleLogout}>
                <span>Cerrar Sesión</span>
              </button>
            </div>
            <span className="dropdown-arrow">▼</span>
          </button>
        </div>
      </div>
    </header>
    </>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  breadcrumbPath: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default Header;
