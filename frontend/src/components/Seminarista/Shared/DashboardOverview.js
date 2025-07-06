import React from 'react';
import StatsCard from './StatsCard';
import ActionCard from './ActionCard';

const DashboardOverview = ({ onTabChange, onReservar, user }) => {
  const statsData = [
    {
      title: 'Dashboard Activo',
      value: '✓',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      color: 'primary',
      trend: { direction: 'up', value: 'ONLINE' },
      description: 'Sistema funcionando correctamente'
    },
    {
      title: 'Acceso Verificado',
      value: '�',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <circle cx="12" cy="16" r="1"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      color: 'success',
      description: 'Autenticación segura activa'
    },
    {
      title: 'Navegación Rápida',
      value: '⚡',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
        </svg>
      ),
      color: 'warning',
      description: 'Acceso optimizado a funciones'
    },
    {
      title: 'Recursos',
      value: '📊',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="20" x2="12" y2="10"/>
          <line x1="18" y1="20" x2="18" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="16"/>
        </svg>
      ),
      color: 'info',
      description: 'Herramientas disponibles'
    }
  ];

  const actionCards = [
    {
      title: 'Explorar Eventos',
      description: 'Descubre eventos disponibles y regístrate para participar',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      onClick: () => onTabChange('eventos'),
      variant: 'primary'
    },
    {
      title: 'Reservar Cabañas',
      description: 'Encuentra y reserva cabañas disponibles para retiros',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      ),
      onClick: () => onTabChange('cabanas'),
      variant: 'secondary'
    },
    {
      title: 'Mis Inscripciones',
      description: 'Gestiona tus inscripciones a eventos y actividades',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      onClick: () => onTabChange('mis-inscripciones'),
      variant: 'success'
    },
    {
      title: 'Nueva Solicitud',
      description: 'Crea una nueva solicitud o petición administrativa',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
      onClick: () => onTabChange('crear-solicitud'),
      variant: 'warning'
    }
  ];

  return (
    <div className="dashboard-overview">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2 className="welcome-title">
            ¡Bienvenido, {user?.nombre || 'Seminarista'}! 👋
          </h2>
          <p className="welcome-description">
            Este es tu panel personalizado donde puedes gestionar eventos, reservas de cabañas, 
            solicitudes y mantener un seguimiento completo de tus actividades en el seminario.
            Todo está diseñado para una experiencia fluida y eficiente.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            description={stat.description}
          />
        ))}
      </div>

      {/* Action Cards */}
      <div className="actions-section">
        <h3 className="section-title">🚀 Acciones Principales</h3>
        <div className="action-cards-grid">
          {actionCards.map((card, index) => (
            <ActionCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              onClick={card.onClick}
              variant={card.variant}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3 className="section-title">📈 Actividad Reciente</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon activity-icon-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
            <div className="activity-content">
              <p className="activity-text">Acceso exitoso al dashboard</p>
              <span className="activity-time">Hace unos momentos</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon activity-icon-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="activity-content">
              <p className="activity-text">Dashboard actualizado con nueva interfaz</p>
              <span className="activity-time">Hoy</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon activity-icon-warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L13 17.77l-6.18 3.25L8 14.14 3 9.27l6.91-1.01L13 2z"/>
              </svg>
            </div>
            <div className="activity-content">
              <p className="activity-text">Nuevas funcionalidades disponibles</p>
              <span className="activity-time">Esta semana</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
