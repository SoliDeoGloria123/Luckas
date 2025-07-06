import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  useEffect(() => {
    // Theme management
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.body.classList.add('theme-light');
    }

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    // Observe elements that should animate
    const elementsToAnimate = document.querySelectorAll('.neo-container, .neo-card');
    elementsToAnimate.forEach(el => {
      observer.observe(el);
    });

    // Scroll effects
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const heroContent = document.querySelector('.hero-content');
      const waves = document.querySelectorAll('.wave');
      const scrollIndicator = document.querySelector('.scroll-indicator');
      const header = document.querySelector('.neo-header');

      if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      }

      waves.forEach((wave, index) => {
        wave.style.transform = `translateX(-50%) rotate(${scrolled * (0.1 + index * 0.05)}deg)`;
      });

      if (scrollIndicator) {
        if (scrolled > 100) {
          scrollIndicator.classList.add('hidden');
        } else {
          scrollIndicator.classList.remove('hidden');
        }
      }

      if (header) {
        if (scrolled > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle('theme-light');
    document.body.classList.toggle('theme-light');
    
    const currentTheme = document.documentElement.classList.contains('theme-light') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    
    // Force repaint to ensure styles are applied
    document.body.style.display = 'none';
    document.body.offsetHeight; // trigger reflow
    document.body.style.display = '';
  };

  const handleScrollIndicatorClick = () => {
    const mainContent = document.querySelector('main .neo-container');
    if (mainContent) {
      const headerHeight = document.querySelector('.neo-header')?.offsetHeight || 90;
      const targetPosition = mainContent.offsetTop - headerHeight - 20;
      
      window.scrollTo({ 
        top: targetPosition, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <>
      {/* Animated background */}
      <div className="animated-bg"></div>

      {/* Header */}
      <header className="neo-header">
        <div className="header-container">
          <div className="logo-container">
            <img 
              src="/static/img/lOGO PROYECTO LuckasEnt de Kent.png" 
              alt="Logo del Seminario" 
              className="logo" 
            />
            <h1 className="seminary-title">Luckas</h1>
          </div>
          <nav>
            <ul>
              <li><Link to="/app/" className="active">Inicio</Link></li>
              <li><Link to="/app/cursos">Cursos</Link></li>
              <li><Link to="/app/inscripcion-info">Inscripción</Link></li>
            </ul>
            <Link to="/app/login" className="neo-button login-button">Iniciar Sesión</Link>
          </nav>
          <div className="menu-toggle">
            <i className="fas fa-bars"></i>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h2>Bienvenido a Luckas</h2>
          <p>Formando líderes con fundamento bíblico para servir a Dios y a la comunidad</p>
          <div className="cta-buttons">
            <Link to="/cursos" className="neo-button">Ver Cursos</Link>
            <Link to="/inscripcion-info" className="neo-button">Inscríbete Ahora</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" onClick={handleScrollIndicatorClick}>
          <p>Desplázate para descubrir más</p>
          <div className="scroll-arrow"></div>
        </div>

        {/* Animated waves */}
        <div className="wave-container">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>

      <main>
        {/* Featured Courses Section */}
        <section className="cursos-destacados neo-container fade-in">
          <h2>Cursos Destacados</h2>
          <div className="curso-cards">
            <div className="neo-card curso-card">
              <div className="curso-imagen"></div>
              <h3>Fundamentos Bíblicos</h3>
              <p>Introducción a los principios fundamentales de la Biblia y su interpretación.</p>
              <div className="curso-info">
                <span><i className="fas fa-calendar"></i> 3 meses</span>
                <span><i className="fas fa-clock"></i> 60 horas</span>
              </div>
              <Link to="/cursos" className="neo-button">Ver Detalles</Link>
            </div>
            <div className="neo-card curso-card">
              <div className="curso-imagen"></div>
              <h3>Teología Sistemática</h3>
              <p>Estudio organizado de las doctrinas cristianas y su aplicación contemporánea.</p>
              <div className="curso-info">
                <span><i className="fas fa-calendar"></i> 4 meses</span>
                <span><i className="fas fa-clock"></i> 80 horas</span>
              </div>
              <Link to="/cursos" className="neo-button">Ver Detalles</Link>
            </div>
            <div className="neo-card curso-card">
              <div className="curso-imagen"></div>
              <h3>Liderazgo Pastoral</h3>
              <p>Desarrollo de habilidades para el liderazgo efectivo en el contexto ministerial.</p>
              <div className="curso-info">
                <span><i className="fas fa-calendar"></i> 3 meses</span>
                <span><i className="fas fa-clock"></i> 60 horas</span>
              </div>
              <Link to="/cursos" className="neo-button">Ver Detalles</Link>
            </div>
          </div>
          <div className="center-button">
            <Link to="/cursos" className="neo-button">Ver Todos los Cursos</Link>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonio neo-container fade-in">
          <h2>Testimonios de Nuestros Estudiantes</h2>
          <div className="testimonios-slider">
            <div className="neo-card testimonio-card">
              <div className="testimonio-content">
                <p>"Luckas transformó mi vida y ministerio. Los profesores son excelentes y el contenido de los cursos es profundo y práctico."</p>
                <div className="testimonio-autor">
                  <img src="/static/img/sample_0.jpg" alt="Foto de Juan Pérez" />
                  <div>
                    <h4>Juan Pérez</h4>
                    <p>Pastor - Iglesia Bautista Emanuel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="inscripcion-cta neo-container fade-in">
          <h2>¿Listo para comenzar tu formación?</h2>
          <p>Inscríbete ahora en nuestro seminario y da el primer paso hacia tu crecimiento ministerial.</p>
          <Link to="/inscripcion-info" className="neo-button">Inscríbete Ahora</Link>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-column">
            <h3>Luckas</h3>
            <p>Formando líderes con fundamento bíblico desde 1990.</p>
            <div className="social-links">
              <a href="#" className="neo-social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="neo-social"><i className="fab fa-instagram"></i></a>
              <a href="#" className="neo-social"><i className="fab fa-youtube"></i></a>
              <a href="#" className="neo-social"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/cursos">Cursos</Link></li>
              <li><Link to="/inscripcion-info">Inscripción</Link></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Contacto</h3>
            <ul className="contact-info">
              <li><i className="fas fa-map-marker-alt"></i> SBC Berea, Tenjo, Cundinamarca</li>
              <li><i className="fas fa-phone"></i> +57 (601) 123-4567</li>
              <li><i className="fas fa-envelope"></i> info@luckas.org</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Luckas. Todos los derechos reservados. <span className="signature">SoliDeoGloria123</span></p>
        </div>
      </footer>

      {/* Theme Switcher */}
      <div className="theme-switcher">
        <button className="theme-toggle" onClick={handleThemeToggle}>
          <i className="fas fa-sun"></i>
          <i className="fas fa-moon"></i>
        </button>
      </div>
    </>
  );
};

export default Home;