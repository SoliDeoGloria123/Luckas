import React, { useState, useEffect } from 'react';

import { useAuthCheck } from './hooks/useAuthCheck';
import { eventService } from '../../services/eventService';
import { cabanaService } from '../../services/cabanaService'
import Footer from '../footer/Footer'
import Header from './Shared/Header';

import './DashboardSeminarista.css';

const DashboardSeminarista = () => {
  // Estados eliminados por no usarse el valor, solo el setter
  const setMostrarModificarPerfil = useState(false)[1];
  const setMensaje = useState('')[1];
  const setMensajeTipo = useState('info')[1];
  const setEventos = useState([])[1];
  const setCabanas = useState([])[1];
  const setLoadingEventos = useState(true)[1];
  const setLoadingCabanas = useState(true)[1];

  // Verificar autenticación y rol
  const { isAuthenticated, user } = useAuthCheck('seminarista');

  // Escuchar evento de modificar perfil
  useEffect(() => {
    const handleModificarPerfil = () => {
      setMostrarModificarPerfil(true);
    };

    globalThis.addEventListener('modificar-perfil', handleModificarPerfil);
    return () => {
      globalThis.removeEventListener('modificar-perfil', handleModificarPerfil);
    };
  }, []);

  // Fetch eventos y cabañas
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await eventService.getAllEvents();
        let eventosArray = [];
        if (Array.isArray(data)) {
          eventosArray = data;
        } else if (data && Array.isArray(data.eventos)) {
          eventosArray = data.eventos;
        } else if (data && Array.isArray(data.data)) {
          eventosArray = data.data;
        }
        setEventos(eventosArray);
      } catch (err) {
        setEventos([]);
        console.error('Error fetching eventos:', err);
      } finally {
        setLoadingEventos(false);
      }
    };
    fetchEventos();
    const fetchCabanas = async () => {
      try {
        const data = await cabanaService.getAll();
        let cabanasArray = [];
        if (Array.isArray(data)) {
          cabanasArray = data;
        } else if (data && Array.isArray(data.cabanas)) {
          cabanasArray = data.cabanas;
        } else if (data && Array.isArray(data.data)) {
          cabanasArray = data.data;
        }
        setCabanas(cabanasArray);
      } catch (err) {
        setCabanas([]);
        console.error('Error fetching cabañas:', err);
      } finally {
        setLoadingCabanas(false);
      }
    };
    fetchCabanas();
  }, []);

  // Si no está autenticado, el hook se encarga de la redirección
  if (!isAuthenticated) {
    return <div>Cargando...</div>;
  }

  const handleSuccess = (mensaje, tipo = 'success') => {
    setMensaje(mensaje);
    setMensajeTipo(tipo);
    setTimeout(() => {
      setMensaje('');
      setMensajeTipo('info');
    }, 5000);
  };
    return (
      <div className="dashboard-seminarista-contenedo">
        <Header/>
        <main className="main-content">
          {/* Hero Section */}

            <div className="hero-content">
              <div className="hero-text">
                <h1>¡Bienvenido, <span className="highlight">Seminarista</span>!</h1>
                <p>Tu panel de control moderno y centralizado. Gestiona eventos, reservas de cabañas, solicitudes y mantén un seguimiento completo de todas tus actividades seminariales con estilo y eficiencia.</p>
              </div>
              <div className="hero-stats">
                <div className="stat-card">
                  <div className="stat-icon system">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 12l2 2 4-4" />
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                      <path d="M13 12h3a2 2 0 0 1 2 2v1" />
                      <path d="M11 12H8a2 2 0 0 0-2 2v1" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Sistema Activo</h3>
                    <p>Dashboard en línea</p>
                    <span className="status-badge active">✓ Funcionando correctamente</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon security">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Acceso Seguro</h3>
                    <p>Autenticación verificada</p>
                    <span className="status-badge secure">✓ Protegido</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon navigation">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Navegación Rápida</h3>
                    <p>Acceso optimizado</p>
                    <span className="status-badge ready">✓ Listo para usar</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon resources">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>Recursos</h3>
                    <p>Herramientas disponibles</p>
                    <span className="status-badge available">✓ Todo disponible</span>
                  </div>
                </div>
              </div>
            </div>


          {/* Services Grid */}
          <section className="services-section">
            <div className="section-header">
              <h2>Servicios Principales</h2>
              <p>Accede rápidamente a las funciones más importantes</p>
            </div>

            <div className="services-grid">
              <div className="service-card events">
                <div className="service-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="service-content">
                  <h3>Eventos</h3>
                  <p>Explora y participa en eventos del seminario</p>
                  <button className="service-btn">Explorar Eventos</button>
                </div>
              </div>

              <div className="service-card cabins">
                <div className="service-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9,22 9,12 15,12 15,22" />
                  </svg>
                </div>
                <div className="service-content">
                  <h3>Cabañas</h3>
                  <p>Descubre y reserva cabañas disponibles</p>
                  <button className="service-btn">Ver Cabañas</button>
                </div>
              </div>

              <div className="service-card inscriptions">
                <div className="service-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                </div>
                <div className="service-content">
                  <h3>Mis Inscripciones</h3>
                  <p>Revisa tus inscripciones a eventos</p>
                  <button className="service-btn">Ver Inscripciones</button>
                </div>
              </div>

              <div className="service-card reservations">
                <div className="service-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="service-content">
                  <h3>Mis Reservas</h3>
                  <p>Gestiona tus reservas de cabañas</p>
                  <button className="service-btn">Ver Reservas</button>
                </div>
              </div>

              <div className="service-card requests">
                <div className="service-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="service-content">
                  <h3>Mis Solicitudes</h3>
                  <p>Consulta el estado de tus solicitudes</p>
                  <button className="service-btn">Ver Solicitudes</button>
                </div>
              </div>

              <div className="service-card new-request">
                <div className="service-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <div className="service-content">
                  <h3>Nueva Solicitud</h3>
                  <p>Crea una nueva solicitud</p>
                  <button className="service-btn">Crear Solicitud</button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions-section">
            <div className="section-header">
              <h2>Acciones Rápidas</h2>
              <p>Funciones frecuentemente utilizadas</p>
            </div>

            <div className="quick-actions-grid">
              <button className="quick-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Próximos Eventos</span>
              </button>

              <button className="quick-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>Reservar Cabaña</span>
              </button>

              <button className="quick-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                </svg>
                <span>Estado Solicitudes</span>
              </button>

              <button className="quick-action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Configuración</span>
              </button>
            </div>
          </section>
        </main>
        <Footer></Footer>
      </div>
    );
  
};

export default DashboardSeminarista;
