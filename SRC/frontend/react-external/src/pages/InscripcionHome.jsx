import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './InscripcionHome.css';

const InscripcionHome = () => {
  const programas = [
    {
      id: 'servicio-cristiano',
      titulo: 'Servicio Cristiano',
      descripcion: 'Licenciatura en Estudios Teológicos con enfoque ministerial práctico.',
      duracion: '4 semestres',
      creditos: '120 créditos',
      imagen: 'programa-servicio.jpg'
    },
    {
      id: 'teologia-pastoral',
      titulo: 'Teología Pastoral',
      descripcion: 'Formación integral para pastores y líderes de iglesias locales.',
      duracion: '6 semestres',
      creditos: '180 créditos',
      imagen: 'programa-teologia.jpg'
    },
    {
      id: 'cursos-intensivos',
      titulo: 'Cursos Intensivos',
      descripcion: 'Programas cortos especializados en diferentes áreas del ministerio.',
      duracion: '1-3 meses',
      creditos: '40-60 horas',
      imagen: 'programa-intensivos.jpg'
    }
  ];

  const procesoSteps = [
    {
      numero: 1,
      titulo: 'Elige tu Programa',
      descripcion: 'Explora nuestros programas y selecciona el que mejor se adapte a tus necesidades y llamado.'
    },
    {
      numero: 2,
      titulo: 'Completa el Formulario',
      descripcion: 'Llena el formulario de solicitud con tus datos personales y académicos.'
    },
    {
      numero: 3,
      titulo: 'Envía Documentación',
      descripcion: 'Adjunta los documentos requeridos según el programa seleccionado.'
    },
    {
      numero: 4,
      titulo: 'Entrevista Personal',
      descripcion: 'Participa en una entrevista con nuestro equipo académico (presencial o virtual).'
    },
    {
      numero: 5,
      titulo: 'Pago de Matrícula',
      descripcion: 'Completa el proceso de pago según las opciones disponibles.'
    },
    {
      numero: 6,
      titulo: '¡Bienvenido a Luckas!',
      descripcion: 'Recibe tu confirmación y orientación para iniciar tu formación.'
    }
  ];

  const requisitosGenerales = [
    'Ser cristiano bautizado con al menos 2 años de testimonio',
    'Tener 18 años cumplidos',
    'Bachillerato completo o equivalente',
    'Membresía activa en una iglesia local',
    'Examen médico general reciente'
  ];

  const documentacion = [
    'Formulario de solicitud completo',
    'Copia del documento de identidad',
    'Diploma de bachillerato o equivalente',
    'Carta de recomendación pastoral',
    'Certificado médico reciente',
    'Fotografías tamaño carnet'
  ];

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
              src="/static/img/lOGO PROYECTO LuckasEnt.png" 
              alt="Logo del Seminario" 
              className="logo" 
            />
            <h1 className="seminary-title">Luckas</h1>
          </div>
          <nav>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/cursos">Cursos</Link></li>
              <li><Link to="/inscripcion-info" className="active">Inscripción</Link></li>
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
          <h2>Comienza Tu Formación Ministerial</h2>
          <p>Inscríbete en los programas del Seminario Bautista de Colombia y adquiere fundamentos bíblicos sólidos</p>
          <div className="cta-buttons">
            <a href="#programas" className="neo-button">Ver Programas</a>
            <a href="#proceso" className="neo-button">Proceso de Inscripción</a>
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
        {/* Available Programs Section */}
        <section id="programas" className="programas-section neo-container fade-in">
          <h2>Programas Disponibles</h2>
          <p className="section-description">Elige entre nuestros diferentes programas diseñados para equiparte en tu llamado</p>
          
          <div className="programas-grid">
            {programas.map((programa) => (
              <div key={programa.id} className="neo-card programa-card">
                <div className="programa-imagen" style={{backgroundImage: `url('/static/img/${programa.imagen}')`}}></div>
                <h3>{programa.titulo}</h3>
                <p>{programa.descripcion}</p>
                <div className="programa-info">
                  <span><i className="fas fa-calendar"></i> {programa.duracion}</span>
                  <span><i className="fas fa-graduation-cap"></i> {programa.creditos}</span>
                </div>
                <Link to={`/programa/${programa.id}`} className="neo-button">Ver Detalles</Link>
              </div>
            ))}
          </div>
        </section>

        {/* Registration Process Section */}
        <section id="proceso" className="proceso-section section-color" data-color="#0d1a35">
          <div className="neo-container">
            <h2 className="section-title">Proceso de Inscripción</h2>
            <p className="section-description">Sigue estos pasos para iniciar tu formación en Luckas</p>
            
            <div className="proceso-steps">
              {procesoSteps.map((step) => (
                <div key={step.numero} className="proceso-step">
                  <div className="step-number">{step.numero}</div>
                  <div className="step-content">
                    <h3>{step.titulo}</h3>
                    <p>{step.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="proceso-cta">
              <Link to="/register" className="neo-button primary">Comenzar Inscripción</Link>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="requisitos-section neo-container fade-in">
          <h2>Requisitos de Inscripción</h2>
          <p className="section-description">Para aplicar a nuestros programas, los candidatos deben cumplir con estos requisitos:</p>
          
          <div className="requisitos-grid">
            <div className="requisito-card">
              <div className="requisito-icon">
                <i className="fas fa-user"></i>
              </div>
              <h3>Requisitos Generales</h3>
              <ul>
                {requisitosGenerales.map((requisito, index) => (
                  <li key={index}>{requisito}</li>
                ))}
              </ul>
            </div>
            
            <div className="requisito-card">
              <div className="requisito-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3>Documentación</h3>
              <ul>
                {documentacion.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))}
              </ul>
            </div>

            <div className="requisito-card">
              <div className="requisito-icon">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3>Costos</h3>
              <ul>
                <li>Formulario de solicitud: Gratuito</li>
                <li>Matrícula semestre: Consultar</li>
                <li>Mensualidad: Según programa</li>
                <li>Certificados: Incluidos</li>
                <li>Material de estudio: Adicional</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="contacto-section neo-container fade-in">
          <h2>¿Necesitas Más Información?</h2>
          <p className="section-description">Nuestro equipo de admisiones está disponible para resolver todas tus dudas</p>
          
          <div className="contacto-grid">
            <div className="contacto-item">
              <div className="contacto-icon">
                <i className="fas fa-phone"></i>
              </div>
              <h3>Teléfono</h3>
              <p>+57 (601) 123-4567</p>
              <p>Lunes a Viernes 8:00 AM - 5:00 PM</p>
            </div>
            
            <div className="contacto-item">
              <div className="contacto-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email</h3>
              <p>admisiones@luckas.org</p>
              <p>Respuesta en 24 horas</p>
            </div>
            
            <div className="contacto-item">
              <div className="contacto-icon">
                <i className="fas fa-whatsapp"></i>
              </div>
              <h3>WhatsApp</h3>
              <p>+57 300 123-4567</p>
              <p>Atención inmediata</p>
            </div>
          </div>
          
          <div className="contacto-cta">
            <Link to="/contact" className="neo-button">Contactar Admisiones</Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="inscripcion-final-cta neo-container fade-in">
          <h2>¡Da el Primer Paso!</h2>
          <p>Tu formación ministerial te está esperando. Únete a la familia Luckas y comienza a impactar vidas.</p>
          <div className="cta-buttons">
            <Link to="/register" className="neo-button primary">Inscríbete Ahora</Link>
            <Link to="/cursos" className="neo-button">Ver Cursos</Link>
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

export default InscripcionHome;