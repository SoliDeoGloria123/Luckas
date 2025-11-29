import React from 'react';
import { Link } from 'react-router-dom';
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
            <Link to="/" className="footer-btn-primary">Explorar Sistema</Link>
            <Link to="/soporte" className="footer-btn-secondary">Soporte Técnico</Link>
          </div>
        </div>
        <div className="footer-links-column">
          <div className="footer-link-list">
            <div className="footer-link-item">
              <Link to="/" className="footer-link">Inicio</Link>
            </div>
            <div className="footer-link-item">
              <Link to="/contactanos" className="footer-link">Contáctanos</Link>
            </div>
            <div className="footer-link-item">
              <Link to="/ayuda" className="footer-link">Ayuda Online</Link>
            </div>
            <div className="footer-link-item">
              <Link to="/politica" className="footer-link">Política de Privacidad</Link>
            </div>
            <div className="footer-link-item">
              <Link to="/terminos" className="footer-link">Términos de Uso</Link>
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
          <a href="https://facebook.com" className="footer-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
          <a href="https://instagram.com" className="footer-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
          <a href="https://youtube.com" className="footer-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
          <a href="mailto:soporte@luckas.example" className="footer-link" aria-label="Email"><i className="fas fa-envelope"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;