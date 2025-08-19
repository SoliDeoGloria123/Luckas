import React, { useState, useRef,useEffect } from 'react';
import UserMenu from './UserMenu';
import Breadcrumb from './Breadcrumb';
import QuickActions from './QuickActions';
import './Header.css';

const Header = ({ user, breadcrumbPath, onTabChange }) => {
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleModificarPerfil = () => {
    // Emit event to parent component
    const event = new CustomEvent('modificar-perfil');
    window.dispatchEvent(event);
    setMenuUsuarioAbierto(false);
  };


  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Abrir/cerrar al hacer click en el botón
  const toggleDropdown = () => {
    setShowUserDropdown((prev) => !prev);
  };

  // Cerrar si hace click fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          <a href="/seminarista" className="nav-item-seminario active">Inicio</a>
          <a href="/dashboard/seminarista/eventos" className="nav-item-seminario">Eventos</a>
          <a href="/dashboard/seminarista/cabanas" className="nav-item-seminario">Cabañas</a>
          <a href="/dashboard/seminarista/mis-inscripciones" className="nav-item-seminario">Mis Inscripciones</a>
          <a href="/dashboard/seminarista/mis-reservas" className="nav-item-seminario">Mis Reservas</a>
          <a href="/dashboard/seminarista/mis-solicitudes" className="nav-item-seminario">Mis Solicitudes</a>
          <a href="/dashboard/seminarista/nueva-solicitud" className="nav-item-seminario">Nueva Solicitud</a>
        </nav>

        <div className="header-right-seminario">
          <div className="header-icons-seminario">
            <button className="icon-btn-seminario">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </button>
            <button className="icon-btn-seminario">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="notification-dot-seminario"></span>
            </button>
          </div>
          <div className="user-profile-seminario">
            <div className="user-avatar-seminario">S</div>
            <button className="user-menu-button" onClick={toggleDropdown} >
              Semianrio
               <i class="fas fa-chevron-down"></i>
            </button>
            {/* <span className="user-name-seminario">Seminarista</span>*/}
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
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
