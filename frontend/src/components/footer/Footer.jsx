import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <div className="footer-info">
            <h3>Gestiona y administra tu seminario eficientemente</h3>
            <p>Sistema integral de gestión académica y administrativa para el Seminario Bautista de Colombia. Optimiza procesos y mejora la experiencia educativa.</p>
          </div>
          <div className="footer-actions">
            <button className="footer-btn-primary">Explorar Sistema</button>
            <button className="footer-btn-secondary">Soporte Tecnico</button>
          </div>
        </div>
        <div className="footer-links-column">
          <div className="footer-link-list">
            <div className="footer-link-item">
              <button type="button" className="footer-link">Inicio</button>
            </div>
            <div className="footer-link-item">
              <button type="button" className="footer-link">Contáctanos</button>
            </div>
            <div className="footer-link-item">
              <button type="button" className="footer-link">Ayuda Online</button>
            </div>
            <div className="footer-link-item">
              <button type="button" className="footer-link">Política de Privacidad</button>
            </div>
            <div className="footer-link-item">
              <button type="button" className="footer-link">Términos de Uso</button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-logo">
          <img src="/favicon.ico" alt="LUCKAS Logo" />
        </div>
        <div className="footer-copyright">
          <p>© 2024 LUCKAS - Seminario Bautista de Colombia. Todos los derechos reservados.</p>
        </div>
        <div className="footer-social">
          <button type="button" className="footer-link" aria-label="Facebook"><i className="fab fa-facebook"></i></button>
          <button type="button" className="footer-link" aria-label="Instagram"><i className="fab fa-instagram"></i></button>
          <button type="button" className="footer-link" aria-label="YouTube"><i className="fab fa-youtube"></i></button>
          <button type="button" className="footer-link" aria-label="Email"><i className="fas fa-envelope"></i></button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;