import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegistro = () => {
    navigate('/signup/registro');
  };

  return (
    <header className="header-panel-princiapl">
      <nav className="nav-panel-princiapl">
        <div className="nav-brand-panel-princiapl">
          <h1 className="icono-luckas">LUCKAS</h1>
        </div>
        <button
          className="mobile-menu-btn"
          aria-expanded={menuOpen}
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
        <div className={`nav-links-panel-princiapl ${menuOpen ? 'mobile-open' : ''}`}>
          <a href="/" onClick={() => setMenuOpen(false)}>
            Inicio
          </a>
          <a href="#servicios" onClick={() => setMenuOpen(false)}>
            Servicios
          </a>
          <a href="#eventos" onClick={() => setMenuOpen(false)}>
            Eventos
          </a>
          <a href="#testimonios" onClick={() => setMenuOpen(false)}>
            Testimonios
          </a>
          <a href="#contacto" onClick={() => setMenuOpen(false)}>
            Contacto
          </a>
          <div className="nav-actions-panel-princiapl">
            <button
              className="btn-secondary-panel-princiapl"
              onClick={() => {
                setMenuOpen(false);
                handleLogin();
              }}
            >
              Iniciar Sesión
            </button>
            <button
              className="btn-primary-panel-princiapl"
              onClick={() => {
                setMenuOpen(false);
                handleRegistro();
              }}
            >
              Registrarse
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
