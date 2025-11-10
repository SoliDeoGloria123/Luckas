import React, { useEffect, useState } from 'react';
import './MisInscripciones.css';
import Header from '../Shared/Header';
import Footer from '../../footer/Footer'
import StatsGridSeminarista from '../Shared/StatsGridSeminarista';
import FilterButtonsSeminarista from '../Shared/FilterButtonsSeminarista';
import InscripcionCard from '../Shared/InscripcionCard';
import InscripcionModal from '../Shared/InscripcionModal';
import EmptyState from '../Shared/EmptyState';
import {
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { inscripcionService } from '../../../services/inscripcionService';



const MisInscripciones = () => {
  // Estados
  const [inscripciones, setInscripciones] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInscripcion, setCurrentInscripcion] = useState(null);
  const usuarioLogueado = (() => {
    try {
      const usuarioStorage = localStorage.getItem('usuario');
      return usuarioStorage ? JSON.parse(usuarioStorage) : null;
    } catch {
      return null;
    }
  })();
  const userId = usuarioLogueado?._id || usuarioLogueado?.id;

  // Effect para manejar el cierre del modal con Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Enfocar el botón de cerrar del modal para mejor accesibilidad
      const closeButton = document.querySelector('.modal-close-misinscripciones');
      if (closeButton) {
        closeButton.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // Datos de ejemplo (simulando API)
  useEffect(() => {
    if (!userId) return;
    inscripcionService.getIncripcionesPorUsuario(userId)
      .then(data => {
        // Si la respuesta viene como {success, data}, usa data
        const inscripcionData = Array.isArray(data) ? data : data.data;
        setInscripciones(inscripcionData);
      })
      .catch(err => {
        console.error('Error al obtener las inscripciones:', err);
      });
  }, [userId]);

  // Calcular estadísticas en tiempo real
  const stats = {
    confirmadas: inscripciones.filter(i => i.estado === 'Confirmada').length,
    pendientes: inscripciones.filter(i => i.estado === 'Pendiente').length,
    canceladas: inscripciones.filter(i => i.estado === 'Cancelada').length,
    total: inscripciones.length
  };

  // Filtrar inscripciones
  const filterInscripciones = (filter) => {
    setActiveFilter(filter);
  };

  // Abrir modal
  const openModal = (inscripcion) => {
    setCurrentInscripcion(inscripcion);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Cancelar inscripción
  const cancelarInscripcion = () => {
    alert(`Inscripción a "${currentInscripcion.titulo}" cancelada`);
    closeModal();
  };

  // Inscripciones filtradas
  const filteredInscripciones = activeFilter === 'Todas'
    ? inscripciones
    : inscripciones.filter(i => i.estado === activeFilter);
  return (

    <main className="main-content-seminario-inscripciones">
      <Header />
      <div className="container-seminario-inscripciones">
        {/* Encabezado */}
        <div className="page-header-seminario-inscripciones">
          <h1 className="page-title-seminario-inscripciones">Mis Inscripciones</h1>
          <p className="page-subtitle">Gestiona y revisa el estado de tus inscripciones a eventos</p>
        </div>

        {/* Tarjetas de estadísticas */}
        <StatsGridSeminarista 
          stats={[
            { 
              icon: faCheckCircle, 
              count: stats.confirmadas, 
              label: 'Confirmadas', 
              className: 'confirmed' 
            },
            { 
              icon: faExclamationTriangle, 
              count: stats.pendientes, 
              label: 'Pendientes', 
              className: 'pending' 
            },
            { 
              icon: faTimesCircle, 
              count: stats.canceladas, 
              label: 'Canceladas', 
              className: 'cancelled' 
            },
            { 
              icon: faCalendar, 
              count: stats.total, 
              label: 'Total', 
              className: 'total' 
            }
          ]}
        />

        {/* Filtros */}
        <FilterButtonsSeminarista
          activeFilter={activeFilter}
          onFilterChange={filterInscripciones}
          filterOptions={[
            { value: 'Todas', label: 'Todas' },
            { value: 'Confirmada', label: 'Confirmada' },
            { value: 'Pendiente', label: 'Pendiente' },
            { value: 'Cancelada', label: 'Cancelada' }
          ]}
        />
        {/* Lista de inscripciones */}
        {filteredInscripciones.length === 0 && (
          <EmptyState 
            title="No tienes inscripciones registradas"
            subtitle="¡Haz tu primera inscripción y disfruta la experiencia!"
            icon="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          />
        )}

        {/* Lista de inscripciones */}
        {filteredInscripciones.map((inscripcion) => (
          <InscripcionCard 
            key={`inscripcion-${inscripcion.id || inscripcion._id}-${inscripcion.estado}`}
            inscripcion={inscripcion}
            onViewDetails={openModal}
          />
        ))}
        {/* Modal de Detalles */}
        <InscripcionModal
          inscripcion={currentInscripcion}
          isOpen={isModalOpen}
          onClose={closeModal}
          onCancel={cancelarInscripcion}
        />
      </div>
      <Footer />
    </main>
  );
};

export default MisInscripciones;

