import React, { useEffect, useState } from 'react';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { eventService } from '../../../services/eventService';
import { inscripcionService } from '../../../services/inscripcionService';
import './EventosSeminario.css';
import Header from '../Shared/Header';
import Footer from '../../footer/Footer'
import { ArrowLeft, Search, Calendar, Clock, MapPin, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import FormularioInscripcion from '../pages/FormularioInscripcion';

const EventosSeminario = () => {
  const { user } = useAuthCheck('seminarista');
  const [eventos, setEventos] = useState([]);

  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [inscripcionMsg, setInscripcionMsg] = useState(null);
  const [inscripcionLoading, setInscripcionLoading] = useState(false);
  const [misInscripciones, setMisInscripciones] = useState([]);

  useEffect(() => {
    const fetchEventosEInscripciones = async () => {
      try {

        // Cambia getMisInscripciones por getAll (no existe getMisInscripciones en el service)
        const [eventosData, inscripcionesData] = await Promise.all([
          eventService.getAllEvents(),
          inscripcionService.getAll()
        ]);


        let eventosArray = [];
        if (eventosData && Array.isArray(eventosData.data)) {
          eventosArray = eventosData.data;
        } else if (Array.isArray(eventosData)) {
          eventosArray = eventosData;
        } else if (eventosData && Array.isArray(eventosData.eventos)) {
          eventosArray = eventosData.eventos;
        }

        let inscripcionesArray = [];
        if (Array.isArray(inscripcionesData)) {
          inscripcionesArray = inscripcionesData;
        } else if (inscripcionesData && Array.isArray(inscripcionesData.data)) {
          inscripcionesArray = inscripcionesData.data;
        }

        setEventos(eventosArray);
        setMisInscripciones(inscripcionesArray);
      } catch (err) {
        console.error('Error al cargar eventos o inscripciones:', err);
      }
    };

    fetchEventosEInscripciones();
  }, []);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Para futuras mejoras se puede filtrar eventos; por ahora usamos el array completo
  const eventosFiltrados = eventos;

  // Ajustar página si cambia la cantidad de eventos filtrados
  useEffect(() => {
    const newTotal = eventosFiltrados.length === 0 ? 0 : Math.ceil(eventosFiltrados.length / registrosPorPagina);
    setPaginaActual((prev) => {
      if (newTotal === 0) return 1;
      return Math.min(prev, newTotal);
    });
  }, [eventosFiltrados.length]);

  const totalPaginas = eventosFiltrados.length === 0 ? 0 : Math.ceil(eventosFiltrados.length / registrosPorPagina);
  const eventosPaginados = eventosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const estaInscrito = (eventoId) => {
    return misInscripciones.some(
      insc =>
      (insc.tipoReferencia === 'Eventos' &&
        (insc.referencia === eventoId || insc.referencia?._id === eventoId))
    );
  };
  


  const handleInscribir = (evento) => {
    if (estaInscrito(evento._id)) {
      setInscripcionMsg('Ya estás inscrito en este evento.');
      return;
    }
    setEventoSeleccionado(evento);
  };

  const handleSubmitInscripcion = async (e) => {
    e.preventDefault();
    setInscripcionMsg(null);
    setInscripcionLoading(true);
    const form = e.target;

    try {
      const nuevaInscripcion = {
        usuario: user._id,
        evento: eventoSeleccionado._id,
        categoria: form.categoria.value || eventoSeleccionado.categoria,
        nombre: form.nombre.value,
        apellido: form.apellido.value,
        tipoDocumento: form.tipoDocumento.value,
        numeroDocumento: form.numeroDocumento.value,
        correo: form.correo.value,
        telefono: form.telefono.value,
        edad: Number.parseInt(form.edad.value),
        observaciones: form.observaciones.value || undefined
      };

      const response = await inscripcionService.create(nuevaInscripcion);

      // Actualizar la lista de inscripciones
      setMisInscripciones(prev => [...prev, response.data || response]);

      setInscripcionMsg('¡Inscripción exitosa!');
      setTimeout(() => {
        setEventoSeleccionado(null);
        setInscripcionMsg(null);
      }, 1800);
    } catch (err) {
      console.error('Error al inscribirse:', err);
      setInscripcionMsg('Error al inscribirse. Intenta de nuevo.');
    } finally {
      setInscripcionLoading(false);
    }

  };
  // 4. Cerrar el formulario
  const handleCloseFormulario = () => {
    setEventoSeleccionado(null);
    setInscripcionMsg(null);
  };
  return (
    <div className="eventos-seminario">
      <Header />
      <main className="main-content-seminarista">
        <div className="breadcrumb-seminarista">
          <button className="back-btn-seminarista">
            <ArrowLeft size={20} />
            Volver al Dashboard
          </button>
        </div>

        <div className="page-header-seminarista">
          <div className="page-title-seminarista">
            <h1>Eventos del Seminario</h1>
            <p>Descubre y participa en los eventos más importantes de nuestra comunidad</p>
          </div>
          <div className="page-stats-seminarista">
            <div className="stat-item-seminarista">
              <span className="stat-number-seminarista">24</span>
              <span className="stat-label-seminarista">Eventos Activos</span>
            </div>
            <div className="stat-item-seminarista">
              <span className="stat-number-seminarista">156</span>
              <span className="stat-label-seminarista">Participantes</span>
            </div>
            <div className="stat-item-seminarista">
              <span className="stat-number-seminarista">8</span>
              <span className="stat-label-seminarista">Este Mes</span>
            </div>
          </div>
        </div>

        <div className="filters-section-seminarista">
          <div className="search-bar-seminarista">
            <Search className="search-icon-seminarista" size={20} />
            <input type="text" placeholder="Buscar eventos..." id="searchInput" />
          </div>

          <div className="filter-buttons">
            <button className="filter-btn active" data-category="todos">Todos</button>
            <button className="filter-btn" data-category="espiritual">Espiritual</button>
            <button className="filter-btn" data-category="academico">Académico</button>
            <button className="filter-btn" data-category="social">Social</button>
            <button className="filter-btn" data-category="deportivo">Deportivo</button>
          </div>

          <div className="sort-dropdown">
            <select id="sortSelect">
              <option value="fecha">Ordenar por fecha</option>
              <option value="precio">Ordenar por precio</option>
              <option value="popularidad">Ordenar por popularidad</option>
            </select>
          </div>
        </div>

        <div className="events-grid" id="eventsGrid">
          
           {eventosPaginados.map(ev => {
              const inscrito = estaInscrito(ev._id);
              return (
                <div
                  className={`event-card${inscrito ? ' event-card-inscrito' : ''}`}
                  data-category="academico"
                  key={ev._id}
                >
                  <div className="event-image">
                    <img src={ev.imagen && ev.imagen[0] ? ev.imagen[0] : "/placeholder.svg"} alt="Imagen del evento" />
                    <div className="event-badge priority-high">Prioridad {ev.prioridad} </div>
                    <div className="event-date">
                      <span className="day">{new Date(ev.fechaEvento).getDate()}</span>
                      <span className="month"> {new Date(ev.fechaEvento).toLocaleString('es-ES', { month: 'short' }).charAt(0).toUpperCase() +
                        new Date(ev.fechaEvento).toLocaleString('es-ES', { month: 'short' }).slice(1)}</span>
                    </div>
                  </div>
                  <div className="event-content">
                    <div className="event-category">Académico</div>
                    <h3 className="event-title">{ev.nombre || '-'}</h3>
                    <p className="event-description">{ev.descripcion}</p>
                    <div className="event-details">
                      <div className="detail-item--seminarista">
                        <Calendar size={16} />
                        <span>{new Date(ev.fechaEvento).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item--seminarista">
                        <Clock size={16} />
                        <span>{ev.horaInicio}-{ev.horaFin}</span>
                      </div>
                      <div className="detail-item--seminarista">
                        <MapPin size={16} />
                        <span>{ev.lugar}</span>
                      </div>
                    </div>
                    <div className="event-footer">
                      <div className="event-price">
                        <span className="price">${ev.precio}</span>
                        <span className="price-label">COP</span>
                      </div>
                      <div className="event-participants">
                        <div className="participants-avatars">
                          <div className="avatar">J</div>
                          <div className="avatar">M</div>
                          <div className="avatar">C</div>
                          <div className="avatar-count">+12</div>
                        </div>
                      </div>
                    </div>
                    {inscrito && (
                      <div className="inscrito-msg">
                        <span style={{ fontSize: '1.1em', fontWeight: 700 }}>Estás inscrito a este evento</span>
                      </div>
                    )}
                    <button className="evento-btn" onClick={() => handleInscribir(ev)} disabled={inscrito}>
                      <Check size={16} />
                      {inscrito ? "Ya inscrito" : "Inscribirme"}
                    </button>
                  </div>
                </div>
                );
           
              })}
          {eventoSeleccionado && (
            <FormularioInscripcion
              evento={eventoSeleccionado}
              usuario={user}
              loading={inscripcionLoading}
              mesage={inscripcionMsg}
              onsubmit={handleSubmitInscripcion}
              onClose={handleCloseFormulario}
            />
          )}

        </div>
       

        {totalPaginas > 1 && (
          <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
            <button
              className="pagination-btn-admin"
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-info-admin">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              className="pagination-btn-admin"
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual >= totalPaginas}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
        {/*<div className="load-more-section">
          <button className="load-more-btn" >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Cargar más eventos
          </button>
        </div>*/}
      </main>

      <Footer />
    </div>
  );
};

export default EventosSeminario;