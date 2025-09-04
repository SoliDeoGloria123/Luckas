// frontend/src/pages/External/ExternalDashboard.js
import React, { useState, useEffect } from 'react';
import './ExternalDashboard.css';
import SeminaristaForm from '../../components/External/SeminaristaForm';

const ExternalDashboard = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [inscriptions, setInscriptions] = useState([]);
    const [showSeminaristaForm, setShowSeminaristaForm] = useState(false);

    // Datos simulados (tus compañeros conectarán con el backend real)
    const mockCourses = [
        {
            _id: '1',
            name: 'Teología Bíblica',
            description: 'Curso completo de teología bíblica fundamental',
            duration: '6 meses',
            price: 150000,
            image: '/images/teologia.jpg'
        },
        {
            _id: '2',
            name: 'Homilética',
            description: 'Arte de la predicación cristiana',
            duration: '4 meses',
            price: 120000,
            image: '/images/homiletica.jpg'
        }
    ];

    const mockEvents = [
        {
            _id: '1',
            name: 'Campamento de Jóvenes 2024',
            description: 'Campamento anual para jóvenes cristianos',
            date: '2024-07-15',
            location: 'Seminario Bautista',
            capacity: 100,
            price: 80000
        },
        {
            _id: '2',
            name: 'Conferencia Pastoral',
            description: 'Conferencia para pastores y líderes',
            date: '2024-08-20',
            location: 'Auditorio Principal',
            capacity: 50,
            price: 60000
        }
    ];

    useEffect(() => {
        // Simular carga de datos
        setAvailableCourses(mockCourses);
        setAvailableEvents(mockEvents);
    }, []);

    const handleCourseInscription = (courseId) => {
        alert(`Inscribirse al curso ${courseId} - Aquí se integrará el sistema de pagos`);
    };
    

    const handleEventInscription = (eventId) => {
        alert(`Inscribirse al evento ${eventId} - Aquí se integrará el sistema de pagos`);
    };

    const handleSeminaristaApplication = () => {
        setShowSeminaristaForm(true);
    };

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
                        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                        <button className="cta-button">Perfil</button>
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
                <div className="courses-grid">
                    {availableCourses.map(course => (
                        <div key={course._id} className="course-card">
                            <div className="course-image">
                                <img src={course.image || '/images/default-course.jpg'} alt={course.name} />
                            </div>
                            <div className="course-content">
                                <h3>{course.name}</h3>
                                <p>{course.description}</p>
                                <div className="course-details">
                                    <span className="duration">📅 {course.duration}</span>
                                    <span className="price">💰 ${course.price?.toLocaleString()}</span>
                                </div>
                                <button 
                                    className="inscribe-btn"
                                    onClick={() => handleCourseInscription(course._id)}
                                >
                                    Inscribirse y Pagar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Events Section */}
            <section id="events" className="events-section">
                <h2 className="section-title">Próximos Eventos</h2>
                <div className="events-grid">
                    {availableEvents.map(event => (
                        <div key={event._id} className="event-card">
                            <div className="event-date">
                                <span className="day">{new Date(event.date).getDate()}</span>
                                <span className="month">{new Date(event.date).toLocaleString('es', { month: 'short' })}</span>
                            </div>
                            <div className="event-content">
                                <h3>{event.name}</h3>
                                <p>{event.description}</p>
                                <div className="event-details">
                                    <span>📍 {event.location}</span>
                                    <span>👥 {event.capacity} plazas</span>
                                    <span>💰 ${event.price?.toLocaleString()}</span>
                                </div>
                                <button 
                                    className="inscribe-btn"
                                    onClick={() => handleEventInscription(event._id)}
                                >
                                    Inscribirse
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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
        </div>
    );
};

export default ExternalDashboard;