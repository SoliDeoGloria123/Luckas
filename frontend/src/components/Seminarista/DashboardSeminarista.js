import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModificarPerfil from './pages/ModificarPerfil';
import { useAuthCheck } from './hooks/useAuthCheck';
import { eventService } from '../../services/eventService';
import { cabanaService } from '../../services/cabanaService'
// Modular Components
import Header from './Shared/Header';
import NotificationBanner from './Shared/NotificationBanner';

import './DashboardSeminarista.css';

const DashboardSeminarista = () => {
  const navigate = useNavigate();
  const [mostrarModificarPerfil, setMostrarModificarPerfil] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('info');
  const [eventos, setEventos] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [loadingCabanas, setLoadingCabanas] = useState(true);
  const breadcrumbPath = ['Dashboard', 'Seminarista'];
  
  // Verificar autenticación y rol
  const { isAuthenticated, user } = useAuthCheck('seminarista');

  // Escuchar evento de modificar perfil
  useEffect(() => {
    const handleModificarPerfil = () => {
      setMostrarModificarPerfil(true);
    };

    window.addEventListener('modificar-perfil', handleModificarPerfil);
    return () => {
      window.removeEventListener('modificar-perfil', handleModificarPerfil);
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

  const handleNavigation = (route) => {
    navigate(route);
  };

  const closeMensaje = () => {
    setMensaje('');
    setMensajeTipo('info');
  };

  const renderContent = () => {
    return (
      <>
        <div className="status-cards slide-up">
          <div className="status-card">
            <div className="status-icon">🔒</div>
            <div className="status-info">
              <h3>Sistema Activo</h3>
              <p>Dashboard en línea</p>
              <span className="status-indicator">✓ Funcionando correctamente</span>
            </div>
          </div>
          <div className="status-card">
            <div className="status-icon">🔐</div>
            <div className="status-info">
              <h3>Acceso Seguro</h3>
              <p>Autenticación verificada</p>
              <span className="status-indicator">✓ Protegido</span>
            </div>
          </div>
          <div className="status-card">
            <div className="status-icon">⚡</div>
            <div className="status-info">
              <h3>Navegación Rápida</h3>
              <p>Acceso optimizado</p>
              <span className="status-indicator">✓ Listo para usar</span>
            </div>
          </div>
          <div className="status-card">
            <div className="status-icon">📊</div>
            <div className="status-info">
              <h3>Recursos</h3>
              <p>Herramientas disponibles</p>
              <span className="status-indicator">✓ Todo disponible</span>
            </div>
          </div>
        </div>

        <div className="seccion-bienvenida fade-in">
          <div className="bienvenida-header">
            <h1>
              ¡Bienvenido, <span className="text-accent">{user?.nombre || 'Seminarista'}</span>!
            </h1>
            <p className="bienvenida-subtitle">
              Tu panel de control moderno y centralizado. Gestiona eventos, reservas de cabañas, 
              solicitudes y mantén un seguimiento completo de todas tus actividades seminariales 
              con estilo y eficiencia.
            </p>
          </div>
        </div>

        <div className="dashboard-datos-rapidos">
          <div className="dashboard-dato">
            <span className="dato-titulo">Eventos activos</span>
            {loadingEventos ? <span className="dato-valor">...</span> : <span className="dato-valor">{eventos.length}</span>}
          </div>
          <div className="dashboard-dato">
            <span className="dato-titulo">Cabañas disponibles</span>
            {loadingCabanas ? <span className="dato-valor">...</span> : <span className="dato-valor">{cabanas.length}</span>}
          </div>
        </div>

        <div className="acciones-rapidas">
          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/eventos')}>
            <div className="accion-icon">🎉</div>
            <h3 className="accion-titulo">Eventos</h3>
            <p className="accion-descripcion">
              Explora y participa en eventos del seminario
            </p>
            <button className="accion-button">Explorar Eventos</button>
          </div>
          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/cabanas')}>
            <div className="accion-icon">🏘️</div>
            <h3 className="accion-titulo">Cabañas</h3>
            <p className="accion-descripcion">
              Descubre y reserva cabañas disponibles
            </p>
            <button className="accion-button">Ver Cabañas</button>
          </div>
          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/mis-inscripciones')}>
            <div className="accion-icon">📝</div>
            <h3 className="accion-titulo">Mis Inscripciones</h3>
            <p className="accion-descripcion">
              Revisa tus inscripciones a eventos
            </p>
            <button className="accion-button">Ver Inscripciones</button>
          </div>
          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/mis-reservas')}>
            <div className="accion-icon">🏠</div>
            <h3 className="accion-titulo">Mis Reservas</h3>
            <p className="accion-descripcion">
              Gestiona tus reservas de cabañas
            </p>
            <button className="accion-button">Ver Reservas</button>
          </div>
          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/mis-solicitudes')}>
            <div className="accion-icon">📋</div>
            <h3 className="accion-titulo">Mis Solicitudes</h3>
            <p className="accion-descripcion">
              Consulta el estado de tus solicitudes
            </p>
            <button className="accion-button">Ver Solicitudes</button>
          </div>
          <div className="accion-card" onClick={() => handleNavigation('/dashboard/seminarista/nueva-solicitud')}>
            <div className="accion-icon">✨</div>
            <h3 className="accion-titulo">Nueva Solicitud</h3>
            <p className="accion-descripcion">
              Crea una nueva solicitud
            </p>
            <button className="accion-button">Crear Solicitud</button>
          </div>
        </div>
      </>
    );
  };

  if (mostrarModificarPerfil) {
    return (
      <div className="dashboard-seminarista-contenedo">
        <Header 
          userRole="seminarista" 
          userName={user?.nombre}
          breadcrumbPath={breadcrumbPath}
        />
        
        <main className="main-content">
          <ModificarPerfil 
            onClose={() => setMostrarModificarPerfil(false)}
            onSuccess={handleSuccess}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-seminarista-contenedo">
      <Header 
        userRole="seminarista" 
        userName={user?.nombre}
        breadcrumbPath={breadcrumbPath}
      />
      
      {mensaje && (
        <NotificationBanner 
          message={mensaje}
          type={mensajeTipo}
          onClose={closeMensaje}
        />
      )}
      
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardSeminarista;
