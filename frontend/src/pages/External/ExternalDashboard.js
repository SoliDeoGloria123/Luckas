// frontend/src/pages/External/ExternalDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExternalDashboard.css';
import SeminaristaForm from '../../components/External/SeminaristaForm';
import externalService from '../../services/externalService';
import PaymentModal from '../../components/External/PaymentModal';

const ExternalDashboard = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [inscriptions, setInscriptions] = useState([]);
    const [showSeminaristaForm, setShowSeminaristaForm] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar autenticación
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('usuario');
        
        if (!token || !userData) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userData);
        if (user.role !== 'externo') {
            // Redirigir según el rol
            switch(user.role) {
                case 'admin':
                    navigate('/admin/users');
                    break;
                case 'tesorero':
                    navigate('/tesorero');
                    break;
                case 'seminarista':
                    navigate('/seminarista');
                    break;
                default:
                    navigate('/login');
            }
            return;
        }

        setUser(user);
        loadData();
    }, [navigate]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Cargar cursos y eventos en paralelo
            const [cursosResponse, eventosResponse] = await Promise.all([
                externalService.getCursos(),
                externalService.getEventos()
            ]);

            if (cursosResponse.success) {
                setAvailableCourses(cursosResponse.data || []);
            }

            if (eventosResponse.success) {
                setAvailableEvents(eventosResponse.data || []);
            }

        } catch (error) {
            console.error('Error al cargar datos:', error);
            // Si hay error de autenticación, redirigir al login
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCourseInscription = (course) => {
        setPaymentData({
            type: 'course',
            id: course._id,
            name: course.nombre,
            price: course.precio,
            description: course.descripcion
        });
        setShowPaymentModal(true);
    };
    
    const handleEventInscription = (event) => {
        setPaymentData({
            type: 'event',
            id: event._id,
            name: event.nombre,
            price: event.precio,
            description: event.descripcion
        });
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (paymentInfo) => {
        try {
            // Procesar la inscripción según el tipo
            if (paymentData.type === 'course') {
                await externalService.inscribirCurso(paymentData.id, user._id);
            } else if (paymentData.type === 'event') {
                await externalService.inscribirEvento(paymentData.id, user._id);
            }
            
            alert('¡Inscripción exitosa! Has sido inscrito correctamente.');
            setShowPaymentModal(false);
            setPaymentData(null);
            
            // Recargar datos para actualizar inscripciones
            loadData();
        } catch (error) {
            console.error('Error al procesar inscripción:', error);
            alert('Error al procesar la inscripción. Inténtalo de nuevo.');
        }
    };

    const handleSeminaristaApplication = () => {
        setShowSeminaristaForm(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className={`dashboard ${darkMode ? 'dark' : 'light'}`}>
            {/* Animated Background Shaders */}
            <div className="animated-background">
                <div className="shader-overlay"></div>
            </div>

            {/* Header translúcido */}
            <header className="header-translucent">
                <div className="header-content">
                    <div className="logo">
                        <span className="logo-text">Luckas</span>
                    </div>
                    
                    <nav className="navigation">
                        <a href="#courses">Cursos</a>
                        <a href="#events">Eventos</a>
                        <a href="#seminarista">Ser Seminarista</a>
                        <a href="#inscriptions">Mis Inscripciones</a>
                    </nav>

                    <div className="header-actions">
                        <span className="user-welcome">Hola, {user?.nombre}</span>
                        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                        <button className="cta-button" onClick={handleLogout}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    {/* Badge translúcido */}
                    <div className="announcement-badge">
                        <span>✨ Nuevos cursos disponibles para 2024</span>
                    </div>

                    {/* Título principal combinando fuentes */}
                    <h1 className="hero-title">
                        <span className="title-sans">Bienvenido al</span>{' '}
                        <span className="title-serif">Seminario</span>{' '}
                        <span className="title-sans">Bautista de Colombia</span>
                    </h1>

                    {/* Descripción con opacidad */}
                    <p className="hero-description">
                        Inscríbete a nuestros cursos, eventos y forma parte de nuestra 
                        comunidad educativa. Proceso de inscripción 100% digital con 
                        pagos seguros.
                    </p>

                    {/* Botones contrastantes */}
                    <div className="hero-actions">
                        <button className="btn-transparent" onClick={() => document.getElementById('courses').scrollIntoView()}>
                            Ver Cursos
                        </button>
                        <button className="btn-solid" onClick={() => document.getElementById('events').scrollIntoView()}>
                            Ver Eventos
                        </button>
                    </div>
                </div>

                {/* Círculo pulsante decorativo */}
                <div className="decorative-circle">
                    <div className="rotating-text">
                        <span>SEMINARIO • BAUTISTA • COLOMBIA • </span>
                    </div>
                    <div className="circle-pulse"></div>
                </div>
            </section>

            {/* Courses Section */}
            <section id="courses" className="courses-section">
                <h2 className="section-title">Cursos Disponibles</h2>
                {availableCourses.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay cursos disponibles en este momento.</p>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {availableCourses.map(course => (
                            <div key={course._id} className="course-card">
                                <div className="course-image">
                                    <img src={course.imagen || '/images/default-course.jpg'} alt={course.nombre} />
                                </div>
                                <div className="course-content">
                                    <h3>{course.nombre}</h3>
                                    <p>{course.descripcion}</p>
                                    <div className="course-details">
                                        <span className="duration">📅 {course.duracion}</span>
                                        <span className="price">💰 ${course.precio?.toLocaleString()}</span>
                                    </div>
                                    <button 
                                        className="inscribe-btn"
                                        onClick={() => handleCourseInscription(course)}
                                    >
                                        Inscribirse y Pagar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Events Section */}
            <section id="events" className="events-section">
                <h2 className="section-title">Próximos Eventos</h2>
                {availableEvents.length === 0 ? (
                    <div className="empty-state">
                        <p>No hay eventos programados en este momento.</p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {availableEvents.map(event => (
                            <div key={event._id} className="event-card">
                                <div className="event-date">
                                    <span className="day">{new Date(event.fechaEvento).getDate()}</span>
                                    <span className="month">{new Date(event.fechaEvento).toLocaleString('es', { month: 'short' })}</span>
                                </div>
                                <div className="event-content">
                                    <h3>{event.nombre}</h3>
                                    <p>{event.descripcion}</p>
                                    <div className="event-details">
                                        <span>📍 {event.lugar}</span>
                                        <span>👥 {event.cuposDisponibles} plazas</span>
                                        <span>💰 ${event.precio?.toLocaleString()}</span>
                                    </div>
                                    <button 
                                        className="inscribe-btn"
                                        onClick={() => handleEventInscription(event)}
                                    >
                                        Inscribirse
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Seminarista Application Section */}
            <section id="seminarista" className="seminarista-section">
                <div className="seminarista-content">
                    <h2 className="section-title">Conviértete en Seminarista</h2>
                    <p>Forma parte oficial del Seminario Bautista de Colombia</p>
                    
                    <div className="application-steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Llena la Aplicación</h3>
                            <p>Completa todos los documentos requeridos</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Proceso de Evaluación</h3>
                            <p>Revisaremos tu aplicación y documentos</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Confirmación</h3>
                            <p>Recibirás la confirmación de tu ingreso</p>
                        </div>
                    </div>
                    
                    <button className="apply-btn" onClick={handleSeminaristaApplication}>
                        Aplicar Ahora
                    </button>
                </div>
            </section>

            {/* Mostrar el formulario de Seminarista si corresponde */}
            {showSeminaristaForm && (
                <SeminaristaForm onClose={() => setShowSeminaristaForm(false)} />
            )}

            {/* Modal de pagos */}
            {showPaymentModal && (
                <PaymentModal
                    data={paymentData}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default ExternalDashboard;