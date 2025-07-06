import React, { useState, useEffect } from 'react';
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

  return (
    <header className="seminarista-header">
      <div className="seminarista-header-content">
        <div className="seminarista-header-left">
          <div className="logo-section-seminarista">
            <h1 className="dashboard-title">
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
              <div className="logo-seminarista">
                <span className="luckas-seminarista">Luckas</span><span className="ent-seminarista">ent</span>
              </div>
              <span className="badge-seminarista">Seminarista</span>
            </h1>

          </div>
          <Breadcrumb path={breadcrumbPath} />
        </div>

        <div className="seminarista-header-right">
          <QuickActions onTabChange={onTabChange} />
          <UserMenu
            user={user}
            isOpen={menuUsuarioAbierto}
            onToggle={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
            onLogout={handleLogout}
            onModificarPerfil={handleModificarPerfil}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
