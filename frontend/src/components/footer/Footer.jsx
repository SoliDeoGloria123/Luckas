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
      <div className="footer-bottom">
        <div className="footer-logo">
          <img src="../../public/favicon.ico" alt="LUCKAS Logo" />
        </div>
        <div className="footer-copyright">
          <p>© 2024 LUCKAS - Seminario Bautista de Colombia. Todos los derechos reservados.</p>
        </div>
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          <a href="#" aria-label="Email"><i className="fas fa-envelope"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;