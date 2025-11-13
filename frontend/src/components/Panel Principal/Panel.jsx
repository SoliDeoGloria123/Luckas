import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import './Panel.css'

const PanelPrincipal = () => {

    const navigate = useNavigate();

    const handlLogin = () => {
        navigate('/login');
    };

    const handlRegistro = () => {
        navigate('/signup/registro');
    };


    return (
        <>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"/> 
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
            
            <header className="header-panel-princiapl">
                <nav className="nav-panel-princiapl">
                    <div className="nav-brand-panel-princiapl">
                          <h1 className="icono-luckas" >LUCKAS</h1>
                    </div>
                    <div className="nav-links-panel-princiapl">
                        <a href="#eventos">Eventos</a>
                        <a href="#cursos">Cursos</a>
                        <a href="#cabanas">Cabañas</a>
                        <a href="#contacto">Contacto</a>
                    </div>
                    <div className="nav-actions-panel-princiapl">
                        <button className="btn-secondary-panel-princiapl" onClick={handlLogin}>Iniciar Sesión</button>
                        <button className="btn-primary-panel-princiapl" onClick={handlRegistro}>Registrarse</button>
                    </div>
                </nav>
            </header>


            <section className="hero-panel-princiapl">
                <div className="hero-background-panel-princiapl"></div>
                <div className="hero-content-panel-princiapl">
                    <div className="hero-text-panel-princiapl">
                        <h1 className="hero-title-panel-princiapl">
                            Bienvenido al <span className="gradient-text-panel-princiapl">Seminario Bautista de Colombia</span>
                        </h1>
                        <p className="hero-subtitle-panel-princiapl">
                            Únete a nuestros eventos espirituales, cursos de formación y disfruta de nuestras cabañas en un ambiente de paz y crecimiento espiritual.
                        </p>
                        <div className="hero-buttons-panel-princiapl">
                            <button className="btn-primary btn-large">
                                <span>Explorar Eventos</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth={2} />
                                </svg>
                            </button>
                            <button className="btn-outline btn-large">Ver Cursos</button>
                        </div>
                    </div>
                    <div className="hero-visual-panel-princiapl">
                        <div className="floating-card-panel-princiapl card-1-panel-princiapl">
                            <div className="card-icon-panel-princiapl events-icon">📅</div>
                            <h3>Eventos</h3>
                            <p>Conferencias y retiros espirituales</p>
                        </div>
                        <div className="floating-card-panel-princiapl card-2-panel-princiapl">
                            <div className="card-icon-panel-princiapl courses-icon">📚</div>
                            <h3>Cursos</h3>
                            <p>Formación teológica y ministerial</p>
                        </div>
                        <div className="floating-card-panel-princiapl card-3-panel-princiapl">
                            <div className="card-icon-panel-princiapl cabins-icon">🏠</div>
                            <h3>Cabañas</h3>
                            <p>Alojamiento cómodo y tranquilo</p>
                        </div>
                    </div>
                </div>
            </section>


            <section className="services-panel-princiapl" >
                <div className="container-panel-princiapl">
                    <div className="section-header-panel-princiapl">
                        <h2>Nuestros Servicios</h2>
                        <p>Descubre todo lo que el Seminario Bautista de Colombia tiene para ofrecerte</p>
                    </div>

                    <div className="services-grid-panel-princiapl">

                        <div className="service-card-panel-princiapl" id="eventos">
                            <div className="service-icon-panel-princiapl">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth={2} />
                                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth={2} />
                                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth={2} />
                                    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth={2} />
                                </svg>
                            </div>
                            <h3>Eventos Espirituales</h3>
                            <p>Participa en conferencias, retiros, seminarios y actividades especiales que fortalecerán tu fe y crecimiento espiritual.</p>
                            <ul className="service-features-panel-princiapl">
                                <li>Conferencias con invitados especiales</li>
                                <li>Retiros de fin de semana</li>
                                <li>Seminarios temáticos</li>
                                <li>Actividades familiares</li>
                            </ul>
                            <button className="btn-service-panel-princiapl">Ver Eventos Disponibles</button>
                        </div>


                        <div className="service-card-panel-princiapl" id="cursos">
                            <div className="service-icon-panel-princiapl">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth={2} />
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth={2} />
                                </svg>
                            </div>
                            <h3>Cursos de Formación</h3>
                            <p>Amplía tus conocimientos con nuestros cursos teológicos, ministeriales y de crecimiento personal.</p>
                            <ul className="service-features-panel-princiapl">
                                <li>Teología bíblica</li>
                                <li>Liderazgo cristiano</li>
                                <li>Ministerio pastoral</li>
                                <li>Estudios especializados</li>
                            </ul>
                            <button className="btn-service-panel-princiapl">Explorar Cursos</button>
                        </div>


                        <div className="service-card-panel-princiapl" >
                            <div className="service-icon-panel-princiapl">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 21h18" stroke="currentColor" strokeWidth={2} />
                                    <path d="M5 21V7l8-4v18" stroke="currentColor" strokeWidth={2} />
                                    <path d="M19 21V11l-6-4" stroke="currentColor" strokeWidth={2} />
                                </svg>
                            </div>
                            <h3>Reserva de Cabañas</h3>
                            <p>Disfruta de nuestras cómodas cabañas en un ambiente natural perfecto para el descanso y la reflexión.</p>
                            <ul className="service-features-panel-princiapl">
                                <li>Cabañas familiares</li>
                                <li>Ambiente natural</li>
                                <li>Instalaciones completas</li>
                                <li>Tarifas accesibles</li>
                            </ul>
                            <button className="btn-service-panel-princiapl">Hacer Reserva</button>
                        </div>
                    </div>
                </div>
            </section>


            <section className="cta-section-panel-princiapl">
                <div className="container-panel-princiapl">
                    <div className="cta-content-panel-princiapl">
                        <h2>¿Listo para comenzar tu experiencia?</h2>
                        <p>Regístrate hoy y accede a todos nuestros eventos, cursos y servicios de alojamiento</p>
                        <div className="cta-buttons-panel-princiapl">
                            <button className="btn-primary-panel-princiapl btn-large-panel-princiapl" onClick={handlRegistro}>
                                Crear Cuenta Gratuita
                            </button>
                            <button className="btn-outline-panel-princiapl btn-large-panel-princiapl" onClick={handlLogin}>
                                Iniciar Sesión
                            </button>
                        </div>
                    </div>
                    <div className="cta-visual">
                        <div className="stats-grid-panel-princiapl">
                            <div className="stat-item-panel-princiapl">
                                <div className="stat-number-panel-princiapl">500+</div>
                                <div className="stat-label-panel-princiapl">Participantes</div>
                            </div>
                            <div className="stat-item-panel-princiapl">
                                <div className="stat-number-panel-princiapl">50+</div>
                                <div className="stat-label-panel-princiapl">Eventos Anuales</div>
                            </div>
                            <div className="stat-item-panel-princiapl">
                                <div className="stat-number-panel-princiapl">20+</div>
                                <div className="stat-label-panel-princiapl">Cursos Disponibles</div>
                            </div>
                            <div className="stat-item-panel-princiapl">
                                <div className="stat-number-panel-princiapl">15</div>
                                <div className="stat-label-panel-princiapl">Cabañas</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* <footer className="footer" id="contacto">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>Seminario Bautista de Colombia</h3>
                            <p>Formando líderes cristianos comprometidos con la Palabra de Dios y el servicio al Reino.</p>
                            <div className="contact-info">
                                <p>📍 Dirección del Seminario</p>
                                <p>📞 +57 (1) 234-5678</p>
                                <p>✉️ info@seminariobautista.edu.co</p>
                            </div>
                        </div>
                        <div className="footer-section">
                            <h4>Servicios</h4>
                            <ul>
                                <li><a href="#eventos">Eventos</a></li>
                                <li><a href="#cursos">Cursos</a></li>
                                <li><a href="#cabanas">Cabañas</a></li>
                                <li><a href="#contacto">Contacto</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Información</h4>
                            <ul>
                                <li><a href="#">Sobre Nosotros</a></li>
                                <li><a href="#">Historia</a></li>
                                <li><a href="#">Misión y Visión</a></li>
                                <li><a href="#">Políticas</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Síguenos</h4>
                            <div className="social-links">
                                <a href="#" className="social-link">Facebook</a>
                                <a href="#" className="social-link">Instagram</a>
                                <a href="#" className="social-link">YouTube</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 Seminario Bautista de Colombia. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>*/}
            <Footer />

        </>
    );

};

export default PanelPrincipal;
