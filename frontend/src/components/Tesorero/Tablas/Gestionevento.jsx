import React, { useState, useEffect } from 'react';
import { eventService } from "../../../services/eventService";
import { categorizacionService } from "../../../services/categorizacionService";
import { mostrarAlerta } from '../../utils/alertas';
import EventosModal from '../modal/EventosModal'
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Eye,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';


const Gestionevento = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalEvento] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);
   const [eventoDetalle, setEventoDetalle] = useState(null);
   const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);


  
  // Obtener eventos
  const obtenerEventos = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEventos(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setEventos([]);
    }
  };

  // Obtener categorías
  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      setCategorias(res.data || []);
    } catch (error) {
      setCategorias([]);
    }
  };

  useEffect(() => {
    obtenerEventos();
    obtenerCategorias();
  }, []);
  // Estado de carga y filtrado
  const [cargando, setCargando] = useState(false);
  const eventosFiltrados = eventos; // Puedes aplicar filtros si lo necesitas

  // Carrusel de imágenes: un índice por evento
  const [imgIndices, setImgIndices] = useState({});
  const prevImg = (eventoId, totalImages) => {
    setImgIndices(prev => ({
      ...prev,
      [eventoId]: prev[eventoId] > 0 ? prev[eventoId] - 1 : totalImages - 1
    }));
  };
  const nextImg = (eventoId, totalImages) => {
    setImgIndices(prev => ({
      ...prev,
      [eventoId]: prev[eventoId] < totalImages - 1 ? prev[eventoId] + 1 : 0
    }));
  };

  // Modal de edición
  const onEditar = (evento) => {
    setModalEvento('edit');
    setCurrentItem(evento);
    setShowModal(true);
  };

    const abrirModalVer = (evento) => {
    setEventoDetalle(evento);
    setMostrarModalDetalle(true);
  };

  const handleSubmit = async (data) => {
    if (modalMode === 'create') {
      try {
        await eventService.createEvent(data);
        mostrarAlerta("¡Éxito!", "Evento creado exitosamente");
        obtenerEventos();
      } catch (error) {
        mostrarAlerta("Error", `Error al crear el evento: ${error.message}`);
      }
    } else {
      try {
        await eventService.updateEvent(currentItem._id, data);
        mostrarAlerta("¡Éxito!", "Evento actualizado exitosamente");
        obtenerEventos();
      } catch (error) {
        mostrarAlerta("Error"`Error al actualizar el evento: ${error.message}`);
      }
    }
  };



  const handleCreate = () => {
    setModalEvento('create');
    setCurrentItem(null);
    setShowModal(true);
  };

  return (
    <>
    <Header/>
    <main className="main-content-tesorero">
      <div className="page-header-tesorero">
        <div className="card-header-tesorero">
          <button className="back-btn-tesorero">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="page-title-tesorero">
            <h1>Gestión de Eventos</h1>
            <p>Administra y organiza todos los eventos del sistema</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Nuevo Evento
        </button>
      </div>

      <div className="stats-grid-solicitudes">
        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">4</div>
            <div className="stat-label-solicitudes">Total Eventos</div>
          </div>
          <div className="stat-icon-solicitudes purple">
            <i className="fas fa-calendar-alt"></i>
          </div>
        </div>

        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">1</div>
            <div className="stat-label-solicitudes">Próximos</div>
          </div>
          <div className="stat-icon-solicitudes orange">
            <i class="fas fa-clock"></i>
          </div>
        </div>

        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">1</div>
            <div className="stat-label-solicitudes">Completados</div>
          </div>
          <div className="stat-icon-solicitudes green">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>

        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">2</div>
            <div className="stat-label-solicitudes">Cancelados</div>
          </div>
          <div className="stat-icon-solicitudes red">
            <i class="fas fa-times-circle"></i>
          </div>
        </div>
      </div>

      <div className="filters-section-tesorero">
        <div className="search-filters-tesorero">
          <div className="search-input-container-tesorero">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Buscar usuarios..." id="userSearch"></input>
          </div>
          <select className="filter-select">
            <option value="">Todos los roles</option>
            <option value="administrador">Administrador</option>
            <option value="tesorero">Tesorero</option>
            <option value="seminarista">Seminarista</option>
          </select>
          <select id="statusFilter" className="filter-select">
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div className="export-actions">
          <button className="btn-outline-tesorero" id="exportBtn">
            <i className="fas fa-download"></i>
          </button>
          <button className="btn-outline-tesorero" id="importBtn">
            <i className="fas fa-upload"></i>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cargando ? (
        <div className="col-span-full text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando eventos...</p>
        </div>
      ) : eventosFiltrados.length > 0 ? (
        eventosFiltrados.map((evento) => {
          const imagenes = Array.isArray(evento.imagen) ? evento.imagen : [];
          const imgIndex = imgIndices[evento._id] || 0;
          return (
            <div key={evento._id} className="glass-card rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Imagen del evento */}
              <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
              
                 {imagenes.length > 0 ? (
                  <>
                    <img
                      src={imagenes[imgIndex]}
                      alt={evento.nombre}
                      className="w-full h-64 object-cover"
                      style={{ borderRadius: '1rem' }}
                    />
                    {imagenes.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImg(evento._id, imagenes.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                          style={{ zIndex: 2 }}
                        >
                          {"<"}
                        </button>
                        <button
                          onClick={() => nextImg(evento._id, imagenes.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                          style={{ zIndex: 2 }}
                        >
                          {">"}
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {imagenes.map((_, idx) => (
                            <span
                              key={idx}
                              className={`inline-block w-2 h-2 rounded-full ${imgIndex === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                 <div className="flex items-center justify-center w-full h-64 text-white text-4xl">
                    <span>📅</span>
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/90 text-slate-800 text-xs font-medium rounded-full">
                    {/*tipoEvento.label*/}
                  </span>
                  {evento.destacado && (
                    <span className="px-3 py-1 bg-yellow-500/90 text-white text-xs font-medium rounded-full flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Destacado
                    </span>
                  )}
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${evento.estado === 'activo'
                    ? 'bg-emerald-500/90 text-white'
                    : evento.estado === 'inactivo'
                      ? 'bg-red-500/90 text-white'
                      : evento.estado === 'finalizado'
                        ? 'bg-gray-500/90 text-white'
                        : 'bg-amber-500/90 text-white'
                    }`}>
                    {evento.estado}
                  </span>
                </div>

                {/* Botones de acción */}
                <div className="flex  justify-end  gap-2  px-6 py-3 ">
                  <button
                  onClick={() => abrirModalVer(evento)}
                   className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4" />
                </button>

                  <button
                    onClick={() => onEditar(evento)}
                    className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors "
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                </div>
              </div>

              {/* Contenido del evento */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-2 mb-2">{evento.nombre}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3">{evento.descripcion}</p>
                </div>

                <div className="space-y-3">
                  {/* Fechas */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-600">

                    </span>
                  </div>

                  {/* Ubicación */}
                  {evento.ubicacion && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="text-slate-600 line-clamp-1">{evento.ubicacion}</span>
                    </div>
                  )}

                  {/* Horario */}
                  {(evento.horaInicio || evento.horaFin) && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-slate-600">
                        {evento.horaInicio} {evento.horaFin && `- ${evento.horaFin}`}
                      </span>
                    </div>
                  )}

                  {/* Capacidad */}
                  {evento.capacidadMaxima && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-slate-600">Máximo {evento.capacidadMaxima} participantes</span>
                    </div>
                  )}

                  {/* Precio */}
                  {evento.precio && (
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-600">
                        {/*formatearPrecio(evento.precio)*/}
                      </span>
                    </div>
                  )}

                  {/* Servicios incluidos */}
                  <div className="flex flex-wrap gap-2">
                    {evento.incluyeAlojamiento && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg">
                        🏠 Alojamiento
                      </span>
                    )}
                    {evento.incluyeAlimentacion && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-lg">
                        🍽️ Alimentación
                      </span>
                    )}
                  </div>
                </div>

                {/* Coordinador */}
                {evento.coordinador && (
                  <div className="pt-3 border-t border-slate-200/50">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Coordinador:</span> {evento.coordinador}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full text-center py-12">
          <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay eventos</h3>
          <p className="text-slate-500 mb-6">Comienza creando tu primer eventos o actividad</p>
          <button
            /* onClick={abrirModalCrear}*/
            className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2 inline" />
            Crear Evento
          </button>
        </div>
      )}

      
    </div>
    
   
      {showModal && (
        <EventosModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          categorias={categorias}

        />
      )}
       {/* Lista de Eventos */}
          {mostrarModalDetalle && eventoDetalle && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
                <h2 className="text-2xl font-bold mb-4">{eventoDetalle.nombre}</h2>
                <p className="mb-2"><strong>Descripción:</strong> {eventoDetalle.descripcion}</p>
                <p className="mb-2"><strong>Categoría:</strong> {eventoDetalle.categoria?.nombre || eventoDetalle.categoria}</p>
                <p className="mb-2"><strong>Etiquetas:</strong> {eventoDetalle.etiquetas?.join(', ')}</p>
                <p className="mb-2"><strong>Fecha:</strong> {eventoDetalle.fechaEvento ? new Date(eventoDetalle.fechaEvento).toLocaleDateString() : ''}</p>
                <p className="mb-2"><strong>Hora:</strong> {eventoDetalle.horaInicio} - {eventoDetalle.horaFin}</p>
                <p className="mb-2"><strong>Lugar:</strong> {eventoDetalle.lugar}</p>
                <p className="mb-2"><strong>Dirección:</strong> {eventoDetalle.direccion}</p>
                <p className="mb-2"><strong>Duración (días):</strong> {eventoDetalle.duracionDias}</p>
                <p className="mb-2"><strong>Cupos totales:</strong> {eventoDetalle.cuposTotales}</p>
                <p className="mb-2"><strong>Cupos disponibles:</strong> {eventoDetalle.cuposDisponibles}</p>
                <p className="mb-2"><strong>Precio:</strong> ${eventoDetalle.precio}</p>
                <p className="mb-2"><strong>Prioridad:</strong> {eventoDetalle.prioridad}</p>
                <p className="mb-2"><strong>Observaciones:</strong> {eventoDetalle.observaciones}</p>
                <p className="mb-2"><strong>Coordinador:</strong> {eventoDetalle.categorizadoPor?.nombre || eventoDetalle.categorizadoPor}</p>
                <p className="mb-2"><strong>Fecha categorización:</strong> {eventoDetalle.fechaCategorizacion ? new Date(eventoDetalle.fechaCategorizacion).toLocaleDateString() : ''}</p>
                <p className="mb-2"><strong>Activo:</strong> {eventoDetalle.active ? 'Sí' : 'No'}</p>
                <p className="mb-2"><strong>Programa:</strong> {eventoDetalle.programa && eventoDetalle.programa.length > 0 ? (
                  <ul className="list-disc ml-6">
                    {eventoDetalle.programa.map((mod, i) => (
                      <li key={i}>
                        <strong>{mod.tema}</strong> ({mod.horaInicio} - {mod.horaFin}): {mod.descripcion}
                      </li>
                    ))}
                  </ul>
                ) : 'No definido'}
                </p>
                <div className="flex flex-wrap gap-2 my-4">
                  {Array.isArray(eventoDetalle.imagen) && eventoDetalle.imagen.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Imagen ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  ))}
                </div>
                <button
                  onClick={() => setMostrarModalDetalle(false)}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
    </main>
    <Footer/>
    </>
  );
};

export default Gestionevento;