import React, { useState, useRef, useEffect } from 'react';
import UserMenu from './UserMenu';
import Breadcrumb from './Breadcrumb';
import QuickActions from './QuickActions';
import './Header.css';

const Header = ({ user, breadcrumbPath, onTabChange }) => {
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const [showGestionesDropdown, setShowGestionesDropdown] = useState(false);
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
    window.location.href = '/';
  };

  const handleModificarPerfil = () => {
    // Navegar directamente a la página de perfil
    window.location.href = '/dashboard/seminarista/Mi-Perfil';
    setMenuUsuarioAbierto(false);
  };


  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Abrir/cerrar al hacer click en el botón
  const toggleDropdown = () => {
    setShowUserDropdown((prev) => !prev);
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header className="header-seminario">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
      <div className="header-container-seminario">
        <div className="header-left-seminario">
          <div className="logo-seminario">
            <span className="luckas-seminario">LUCKAS</span>
            <span className="role-badge-seminario">Seminario</span>
          </div>
        </div>

        <nav className="header-nav-seminario">
          <a
            href="/seminarista"
            className={`nav-item-seminario${window.location.pathname === '/seminarista' ? ' active' : ''}`}
          >
            <span className="nav-icon-seminario">🏠</span>Inicio
          </a>
          <a
            href="/dashboard/seminarista/eventos"
            className={`nav-item-seminario${window.location.pathname === '/dashboard/seminarista/eventos' ? ' active' : ''}`}
          >
            <span className="nav-icon-seminario">📅</span>Eventos
          </a>
          <a
            href="/dashboard/seminarista/cabanas"
            className={`nav-item-seminario${window.location.pathname === '/dashboard/seminarista/cabanas' ? ' active' : ''}`}
          >
            <span className="nav-icon-seminario">🏠</span>Cabañas
          </a>
          <a
            href="/dashboard/seminarista/cursos"
            className={`nav-item-seminario${window.location.pathname === '/dashboard/seminarista/cursos' ? ' active' : ''}`}
          >
            <span className="nav-icon-seminario">📚</span>Cursos
          </a>
          <a href="#" className="nav-item-seminario mis-gestiones-btn" onClick={e => { e.preventDefault(); setShowGestionesDropdown(prev => !prev); }}
          >
            <span className="nav-icon">📝</span> Mis Gestiones <span className="dropdown-arrow">▼</span>
          </a>
          <div
            ref={gestionesDropdownRef}
            className={`dropdown-menu-seminario${showGestionesDropdown ? ' show' : ''}`}

          >
            <div className="dropdown-container-seminario">
              <a href="/dashboard/seminarista/mis-inscripciones" className="dropdown-item-seminario"> <span className="dropdown-icon">📋</span>Mis Inscripciones</a>
              <a href="/dashboard/seminarista/mis-reservas" className="dropdown-item-seminario">  <span className="dropdown-icon">🏠</span>Mis Reservas</a>
              <a href="/dashboard/seminarista/mis-solicitudes" className="dropdown-item-seminario"> <span className="dropdown-icon">📄</span>Mis Solicitudes</a>
              <a href="/dashboard/seminarista/nueva-solicitud" className="dropdown-item-seminario"><span className="dropdown-icon">📄</span>Nueva Solicitud</a>
            </div>
          </div>


        </nav>

        <div className="header-right-seminario">
          <div className="header-icons-seminario">
            <button className="icon-btn-seminario">
              <span className="notification-icon-seminario">🔔</span>
              <span className="notification-badge-seminario">3</span>
            </button>
          </div>
          <div className="user-profile-seminario" onClick={toggleDropdown}>
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
              <a href="" className="dropdown-item" onClick={handleLogout}>
                <span>Cerrar Sesión</span>
              </a>
            </div>
            <span class="dropdown-arrow">▼</span>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
