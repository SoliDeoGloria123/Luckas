import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const quickAccessCards = [
    {
      id: 'eventos',
      title: 'Eventos',
      description: 'Gestiona tus inscripciones y pagos de eventos',
      image: '/static/img/events-cover.jpg',
      link: '/eventos',
      status: '2 inscripciones activas',
      statusCount: 2
    },
    {
      id: 'programas',
      title: 'Programas Académicos',
      description: 'Explora y solicita programas de formación teológica',
      image: '/static/img/programs-cover.jpg',
      link: '/programas-academicos',
      status: '1 solicitud en proceso',
      statusCount: 1
    },
    {
      id: 'cabanas',
      title: 'Cabañas',
      description: 'Reserva hospedaje para retiros y eventos especiales',
      image: '/static/img/cabins-cover.jpg',
      link: '/cabanas',
      status: '0 reservas activas',
      statusCount: 0,
      neutral: true
    }
  ];

  const proximosEventos = [
    {
      fecha: '15 Mayo',
      titulo: 'Conferencia de Teología',
      ubicacion: 'Auditorio Principal',
      hora: '9:00 AM'
    },
    {
      fecha: '22 Mayo',
      titulo: 'Retiro Espiritual',
      ubicacion: 'Cabañas del Seminario',
      hora: '6:00 PM'
    },
    {
      fecha: '28 Mayo',
      titulo: 'Seminario de Liderazgo',
      ubicacion: 'Sala de Conferencias',
      hora: '10:00 AM'
    }
  ];

  const anuncios = [
    {
      fecha: '2025-05-10',
      titulo: 'Nuevos Programas Académicos',
      contenido: 'Se han abierto inscripciones para los nuevos programas de Maestría en Teología.',
      importante: true
    },
    {
      fecha: '2025-05-08',
      titulo: 'Mantenimiento de Sistemas',
      contenido: 'El sistema estará en mantenimiento el próximo domingo de 2:00 AM a 6:00 AM.',
      importante: false
    },
    {
      fecha: '2025-05-05',
      titulo: 'Becas Disponibles',
      contenido: 'Nuevas becas de estudio disponibles para estudiantes de excelencia académica.',
      importante: true
    }
  ];

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isOtherMonth: true,
        isToday: false,
        hasEvent: false
      });
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = today.getFullYear() === year && 
                     today.getMonth() === month && 
                     today.getDate() === day;
      const hasEvent = [15, 22, 28].includes(day); // Sample events
      
      days.push({
        day,
        isOtherMonth: false,
        isToday,
        hasEvent
      });
    }

    // Next month days to fill the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextMonthDay = 1;
    while (days.length < totalCells) {
      days.push({
        day: nextMonthDay++,
        isOtherMonth: true,
        isToday: false,
        hasEvent: false
      });
    }

    return days;
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <div className="dashboard-content">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <img src="/static/img/campus-aerial.jpg" alt="Vista aérea del campus" className="banner-image" />
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h2>Bienvenido, {user?.nombre || 'Usuario'}</h2>
          <p>La excelencia académica comienza con la dedicación espiritual</p>
        </div>
      </div>

      {/* Quick Access */}
      <section className="quick-access">
        <div className="section-header">
          <h2>Acceso Rápido</h2>
        </div>
        <div className="quick-access-grid">
          {quickAccessCards.map((card) => (
            <div key={card.id} className={`quick-card ${card.id}`}>
              <div className="quick-card-image">
                <img src={card.image} alt={card.title} />
              </div>
              <div className="quick-card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className="quick-actions">
                  <Link to={card.link} className="btn-primary">Explorar</Link>
                  <div className={`status-pill ${card.neutral ? 'neutral' : ''}`}>
                    <span>{card.statusCount}</span> {card.status.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="dashboard-grid">
        {/* Calendar Section */}
        <section className="calendar-section">
          <div className="section-header">
            <h2>Calendario</h2>
            <Link to="/eventos" className="view-all">Ver todo</Link>
          </div>
          <div className="calendar-container">
            <div className="month-header">
              <button className="month-nav" onClick={() => navigateMonth(-1)}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <h3>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
              <button className="month-nav" onClick={() => navigateMonth(1)}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="calendar">
              <div className="day-names">
                <span>Dom</span>
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
              </div>
              <div className="days">
                {generateCalendar().map((dayInfo, index) => (
                  <span 
                    key={index} 
                    className={`
                      ${dayInfo.isOtherMonth ? 'other-month' : ''}
                      ${dayInfo.isToday ? 'today' : ''}
                      ${dayInfo.hasEvent ? 'event-day' : ''}
                    `}
                  >
                    {dayInfo.day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Próximos Eventos */}
        <section className="events-section">
          <div className="section-header">
            <h2>Próximos Eventos</h2>
            <Link to="/eventos" className="view-all">Ver todos</Link>
          </div>
          <div className="events-list">
            {proximosEventos.map((evento, index) => (
              <div key={index} className="event-item">
                <div className="event-date">
                  <span className="date">{evento.fecha}</span>
                </div>
                <div className="event-details">
                  <h4>{evento.titulo}</h4>
                  <p><i className="fas fa-map-marker-alt"></i> {evento.ubicacion}</p>
                  <p><i className="fas fa-clock"></i> {evento.hora}</p>
                </div>
                <div className="event-actions">
                  <button className="btn-secondary">Ver</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Anuncios */}
        <section className="announcements-section">
          <div className="section-header">
            <h2>Anuncios</h2>
            <Link to="/notificaciones" className="view-all">Ver todos</Link>
          </div>
          <div className="announcements-list">
            {anuncios.map((anuncio, index) => (
              <div key={index} className={`announcement-item ${anuncio.importante ? 'important' : ''}`}>
                <div className="announcement-icon">
                  <i className={`fas ${anuncio.importante ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
                </div>
                <div className="announcement-content">
                  <h4>{anuncio.titulo}</h4>
                  <p>{anuncio.contenido}</p>
                  <span className="announcement-date">{anuncio.fecha}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Progreso Académico */}
        <section className="progress-section">
          <div className="section-header">
            <h2>Mi Progreso</h2>
            <Link to="/programas-academicos" className="view-all">Ver detalles</Link>
          </div>
          <div className="progress-cards">
            <div className="progress-card">
              <div className="progress-icon">
                <i className="fas fa-book"></i>
              </div>
              <div className="progress-info">
                <h4>Cursos Completados</h4>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '75%'}}></div>
                </div>
                <span>6 de 8 cursos</span>
              </div>
            </div>
            
            <div className="progress-card">
              <div className="progress-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="progress-info">
                <h4>Eventos Asistidos</h4>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '60%'}}></div>
                </div>
                <span>12 de 20 eventos</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;