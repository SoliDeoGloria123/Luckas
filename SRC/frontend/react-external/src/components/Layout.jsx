import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Close sidebar when route changes (mobile)
    setSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    // Theme management
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.body.classList.add('theme-light');
    }

    // Handle mobile sidebar outside clicks
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 992 && 
          sidebarOpen && 
          !event.target.closest('.sidebar') &&
          !event.target.closest('.menu-toggle')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle('theme-light');
    document.body.classList.toggle('theme-light');
    
    const currentTheme = document.documentElement.classList.contains('theme-light') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
  };

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      section: 'Panel Principal',
      items: [
        { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' }
      ]
    },
    {
      section: 'Mi Perfil',
      items: [
        { path: '/perfil', icon: 'fas fa-user', label: 'Mi Información' },
        { path: '/notificaciones', icon: 'fas fa-bell', label: 'Notificaciones' }
      ]
    },
    {
      section: 'Académico',
      items: [
        { path: '/eventos', icon: 'fas fa-calendar-alt', label: 'Eventos' },
        { path: '/inscripcion', icon: 'fas fa-edit', label: 'Inscripciones' },
        { path: '/programas-academicos', icon: 'fas fa-graduation-cap', label: 'Programas Académicos' }
      ]
    },
    {
      section: 'Servicios',
      items: [
        { path: '/cabanas', icon: 'fas fa-home', label: 'Cabañas' }
      ]
    }
  ];

  return (
    <>
      {/* Animated background */}
      <div className="wave-background">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      <div className="app-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <img 
              src="/static/img/lOGO PROYECTO LuckasEnt de Kent.png" 
              alt="Logo SBC" 
              className="logo" 
            />
            <h1>Luckas</h1>
          </div>

          <div className="user-profile">
            <div className="user-image-container">
              <img 
                src={user?.foto || "/static/img/meme.jpg"} 
                alt="Perfil de usuario" 
                className="user-image" 
              />
            </div>
            <div className="user-info">
              <h3>{user?.nombre || 'Usuario'} {user?.apellido || ''}</h3>
              <p>{user?.correo || 'correo@ejemplo.com'}</p>
              <span className="user-status">En línea</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((section) => (
              <div key={section.section} className="nav-section">
                <h4>{section.section}</h4>
                <ul>
                  {section.items.map((item) => (
                    <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
                      <Link to={item.path}>
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div className="nav-section">
              <h4>Sistema</h4>
              <ul>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Cerrar Sesión</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <div className="sidebar-footer">
            <p>Seminario Bautista de Colombia</p>
            <p className="version">Luckas v2.1.0</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="page-header">
            <div className="header-left">
              <button 
                className="menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <i className="fas fa-bars"></i>
              </button>
              <h1>Panel Principal</h1>
            </div>
            <div className="header-right">
              <button className="notification-btn">
                <i className="fas fa-bell"></i>
                <span className="notification-badge">3</span>
              </button>
              <button className="theme-toggle" onClick={handleThemeToggle}>
                <i className="fas fa-moon"></i>
                <i className="fas fa-sun"></i>
              </button>
            </div>
          </header>

          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;