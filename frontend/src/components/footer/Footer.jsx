import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <div className="footer-info">
            <div className="footer-heading">Comparte y ahorra en tus compras diarias</div>
            <div className="footer-text">
              Encuentra los mejores precios en supermercados y toma decisiones
              inteligentes para tu hogar.
            </div>
          </div>
          <div className="footer-actions">
            <button className="footer-btn-primary">
              <a href="#" className="footer-btn-text-primary">Explorar</a>
            </button>

            <button className="footer-btn-secondary">
              <a href="#" className="footer-btn-text-secondary">Ayuda</a>
            </button>
          </div>
        </div>
        <div className="footer-links-column">
          <div className="footer-link-list">
            <div className="footer-link-item">
              <a href="#" className="footer-link">Inicio</a>
            </div>
            <div className="footer-link-item">
              <a href="#" className="footer-link">Contáctanos</a>
            </div>
            <div className="footer-link-item">
              <a href="#" className="footer-link">Ayuda Online</a>
            </div>
            <div className="footer-link-item">
              <a href="#" className="footer-link">Política de Privacidad</a>
            </div>
            <div className="footer-link-item">
              <a href="#" className="footer-link">Términos de Uso</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-credits">
        <div className="footer-logo-row">
          <div className="footer-logo-container">
            <img className="footer-logo" src="/img/lOGO PROYECTO LuckasEnt.png" alt="Logo LuckasEnt" />
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom-row">
          <div className="footer-copyright">
            © 2024 LuckasEnt. Todos los derechos reservados.
          </div>
          <div className="footer-social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img className="footer-social-icon" src="/img/Facebook.png" alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img className="footer-social-icon" src="/img/X.png" alt="Twitter" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img className="footer-social-icon" src="/img/Instagram.png" alt="Instagram" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <img className="footer-social-icon" src="/img/LinkedIn.png" alt="LinkedIn" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img className="footer-social-icon" src="/img/Youtube.png" alt="YouTube" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;