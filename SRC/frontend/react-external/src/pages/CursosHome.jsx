import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CursosHome.css';

const CursosHome = () => {
  const [selectedNivel, setSelectedNivel] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedDuracion, setSelectedDuracion] = useState('');

  const cursosData = {
    'estudios-biblicos': [
      {
        id: 'fundamentos',
        titulo: 'Fundamentos Bíblicos',
        descripcion: 'Introducción a los principios fundamentales de la Biblia y su interpretación. Un curso esencial para todo creyente.',
        nivel: 'basico',
        duracion: '3 meses',
        horas: '60 horas',
        precio: '$250 USD',
        imagen: 'images/curso-biblia-1.jpg'
      },
      {
        id: 'hermeneutica',
        titulo: 'Hermenéutica Bíblica',
        descripcion: 'Aprende métodos y principios para interpretar correctamente las Escrituras en sus contextos originales.',
        nivel: 'intermedio',
        duracion: '4 meses',
        horas: '80 horas',
        precio: '$320 USD',
        imagen: 'images/curso-biblia-2.jpg'
      },
      {
        id: 'exegesis',
        titulo: 'Exégesis del Nuevo Testamento',
        descripcion: 'Estudio profundo de los textos del Nuevo Testamento en sus idiomas originales y contexto histórico.',
        nivel: 'avanzado',
        duracion: '5 meses',
        horas: '100 horas',
        precio: '$400 USD',
        imagen: 'images/curso-biblia-3.jpg'
      }
    ],
    'teologia': [
      {
        id: 'teologia-sistematica',
        titulo: 'Teología Sistemática',
        descripcion: 'Estudio organizado de las doctrinas cristianas fundamentales y su aplicación para la vida de fe.',
        nivel: 'basico',
        duracion: '4 meses',
        horas: '80 horas',
        precio: '$320 USD',
        imagen: 'images/curso-teologia-1.jpg'
      },
      {
        id: 'historia-iglesia',
        titulo: 'Historia de la Iglesia',
        descripcion: 'Recorrido por los eventos más importantes en el desarrollo del cristianismo desde sus inicios.',
        nivel: 'intermedio',
        duracion: '3 meses',
        horas: '60 horas',
        precio: '$290 USD',
        imagen: 'images/curso-teologia-2.jpg'
      }
    ],
    'liderazgo': [
      {
        id: 'liderazgo-pastoral',
        titulo: 'Liderazgo Pastoral',
        descripcion: 'Desarrollo de habilidades para el liderazgo efectivo en el contexto ministerial.',
        nivel: 'intermedio',
        duracion: '3 meses',
        horas: '60 horas',
        precio: '$280 USD',
        imagen: 'images/curso-liderazgo-1.jpg'
      }
    ]
  };

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

  const filteredCursos = (categoria) => {
    let cursos = cursosData[categoria] || [];
    
    if (selectedNivel) {
      cursos = cursos.filter(curso => curso.nivel === selectedNivel);
    }
    
    if (selectedDuracion) {
      cursos = cursos.filter(curso => {
        const duracionNum = parseInt(curso.duracion);
        switch (selectedDuracion) {
          case 'corto': return duracionNum <= 2;
          case 'medio': return duracionNum >= 3 && duracionNum <= 4;
          case 'largo': return duracionNum >= 5;
          default: return true;
        }
      });
    }
    
    return cursos;
  };

  const renderCursoCard = (curso) => (
    <div key={curso.id} className="neo-card curso-card fade-in">
      <div className="curso-imagen" style={{backgroundImage: `url('${curso.imagen}')`}}></div>
      <span className={`curso-nivel ${curso.nivel}`}>
        Nivel {curso.nivel.charAt(0).toUpperCase() + curso.nivel.slice(1)}
      </span>
      <h3>{curso.titulo}</h3>
      <p>{curso.descripcion}</p>
      <div className="curso-info">
        <span><i className="fas fa-calendar"></i> {curso.duracion}</span>
        <span><i className="fas fa-clock"></i> {curso.horas}</span>
        <span><i className="fas fa-user-graduate"></i> Certificado</span>
      </div>
      <div className="curso-precio">
        <p>{curso.precio}</p>
      </div>
      <div className="curso-botones">
        <Link to={`/curso/${curso.id}`} className="neo-button">Ver Detalles</Link>
        <Link to={`/inscripcion?curso=${curso.id}`} className="neo-button primary">Inscribirme</Link>
      </div>
    </div>
  );

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
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/cursos" className="active">Cursos</Link></li>
              <li><Link to="/inscripcion-info">Inscripción</Link></li>
            </ul>
            <Link to="/login" className="neo-button login-button">Iniciar Sesión</Link>
          </nav>
          <div className="menu-toggle">
            <i className="fas fa-bars"></i>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h2>Descubre Nuestros Cursos</h2>
          <p>Formación integral diseñada para equiparte en tu camino ministerial y académico</p>
          <div className="cta-buttons">
            <a href="#cursos" className="neo-button">Ver Todos los Cursos</a>
            <Link to="/inscripcion-info" className="neo-button">Inscríbete Ahora</Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator" onClick={handleScrollIndicatorClick}>
          <p>Explora nuestros cursos</p>
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
        {/* Page Title */}
        <section id="cursos" className="page-title neo-container fade-in">
          <h1 className="section-title">Nuestros Cursos</h1>
          <p className="section-description">Explora nuestra oferta académica diseñada para equiparte en tu camino ministerial.</p>
        </section>

        {/* Course Filters */}
        <section className="curso-filters neo-container fade-in">
          <h2>Filtrar Cursos</h2>
          <div className="filter-options">
            <div className="filter-group">
              <label htmlFor="nivel">Nivel:</label>
              <div className="custom-select-wrapper">
                <select 
                  id="nivel" 
                  className="neo-select"
                  value={selectedNivel}
                  onChange={(e) => setSelectedNivel(e.target.value)}
                >
                  <option value="">Todos los niveles</option>
                  <option value="basico">Básico</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
                <div className="select-icon"><i className="fas fa-chevron-down"></i></div>
              </div>
            </div>
            <div className="filter-group">
              <label htmlFor="categoria">Categoría:</label>
              <div className="custom-select-wrapper">
                <select 
                  id="categoria" 
                  className="neo-select"
                  value={selectedCategoria}
                  onChange={(e) => setSelectedCategoria(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  <option value="estudios-biblicos">Estudios Bíblicos</option>
                  <option value="teologia">Teología</option>
                  <option value="liderazgo">Liderazgo</option>
                  <option value="ministerio">Ministerio Práctico</option>
                </select>
                <div className="select-icon"><i className="fas fa-chevron-down"></i></div>
              </div>
            </div>
            <div className="filter-group">
              <label htmlFor="duracion">Duración:</label>
              <div className="custom-select-wrapper">
                <select 
                  id="duracion" 
                  className="neo-select"
                  value={selectedDuracion}
                  onChange={(e) => setSelectedDuracion(e.target.value)}
                >
                  <option value="">Cualquier duración</option>
                  <option value="corto">1-2 meses</option>
                  <option value="medio">3-4 meses</option>
                  <option value="largo">5+ meses</option>
                </select>
                <div className="select-icon"><i className="fas fa-chevron-down"></i></div>
              </div>
            </div>
          </div>
        </section>

        {/* Bible Studies Courses */}
        <section className="cursos-lista neo-container" id="fundamentos">
          <h2>Estudios Bíblicos</h2>
          <div className="curso-cards">
            {filteredCursos('estudios-biblicos').map(renderCursoCard)}
          </div>
        </section>

        {/* Theology Courses */}
        <section className="cursos-lista neo-container" id="teologia">
          <h2>Teología</h2>
          <div className="curso-cards">
            {filteredCursos('teologia').map(renderCursoCard)}
          </div>
        </section>

        {/* Leadership Courses */}
        <section className="cursos-lista neo-container" id="liderazgo">
          <h2>Liderazgo</h2>
          <div className="curso-cards">
            {filteredCursos('liderazgo').map(renderCursoCard)}
          </div>
        </section>

        {/* CTA Section */}
        <section className="inscripcion-cta neo-container fade-in">
          <h2>¿Te interesa algún curso?</h2>
          <p>Inscríbete ahora y comienza tu formación ministerial con nosotros.</p>
          <Link to="/inscripcion-info" className="neo-button">Proceso de Inscripción</Link>
        </section>

        {/* Contact Section */}
        <section className="contacto-cta neo-container fade-in">
          <h2>¿Tienes preguntas sobre nuestros cursos?</h2>
          <p>Nuestro equipo académico está aquí para ayudarte a elegir el mejor camino para tu formación.</p>
          <div class="contact-methods">
            <div class="contact-item">
              <i class="fas fa-phone"></i>
              <p>+57 (601) 123-4567</p>
            </div>
            <div class="contact-item">
              <i class="fas fa-envelope"></i>
              <p>admisiones@luckas.org</p>
            </div>
            <div class="contact-item">
              <i class="fas fa-whatsapp"></i>
              <p>WhatsApp: +57 300 123-4567</p>
            </div>
          </div>
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

export default CursosHome;