import React, { useState, useEffect } from 'react';
import { cabanaService } from '../../../services/cabanaService';
import { categorizacionService } from '../../../services/categorizacionService';
import { useNavigate } from "react-router-dom";
import { mostrarAlerta } from '../../utils/alertas';
import CabanaModal from '../../Dashboard/Modales/CabanaModal';
import Header from '../Header/Header-tesorero';
import Footer from '../../footer/Footer';
import {
  Plus,
  Edit,
  Home,
  Users,
  Wifi,
  Car,
  Utensils,
  DollarSign,
  Eye,
  Star,
  Check,
  X,
  MapPin
} from 'lucide-react';

const Gestioncabana = () => {
  // Estado de carga y filtrado

  // Carrusel de imágenes: un índice por cabaña
  const [imgIndices, setImgIndices] = useState({});
  const [eventoDetalle, setEventoDetalle] = useState(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);

  // Variables para el modal del Dashboard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [nuevaCabana, setNuevaCabana] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
    precio: '',
    categoria: '',
    estado: 'disponible',
    servicios: []
  });
  const [selectedImages, setSelectedImages] = useState([]);

  // Función para obtener el tipo de cabaña (dummy)
  const obtenerTipoCabana = (tipo) => ({ label: tipo || 'Cabaña', icon: <Home className="w-6 h-6" /> });

  // Función para formatear precios (dummy)
  const formatearPrecio = (precio) => `$${precio}`;

  // Servicios disponibles (dummy)
  const serviciosDisponibles = [
    { value: 'wifi', label: 'WiFi', icon: <Wifi className="w-3 h-3" /> },
    { value: 'parqueadero', label: 'Parqueadero', icon: <Car className="w-3 h-3" /> },
    { value: 'restaurante', label: 'Restaurante', icon: <Utensils className="w-3 h-3" /> },
    // ...agrega más si lo necesitas
  ];



  const abrirModalVer = (evento) => {
    setEventoDetalle(evento);
    setMostrarModalDetalle(true);
  };
  const [cabanas, setCabanas] = useState([]);
  const [cargando] = useState(false); // setCargando commented as unused
  const cabanasFiltradas = cabanas;
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();


  // Funciones para navegación de imágenes
  const prevImg = (cabanaId, imagenes) => {
    setImgIndices(prev => ({
      ...prev,
      [cabanaId]: prev[cabanaId] > 0 ? prev[cabanaId] - 1 : imagenes.length - 1
    }));
  };

  const nextImg = (cabanaId, imagenes) => {
    setImgIndices(prev => ({
      ...prev,
      [cabanaId]: prev[cabanaId] < imagenes.length - 1 ? prev[cabanaId] + 1 : 0
    }));
  };

  // Función para renderizar servicios
  const renderServicios = (servicios) => {
    const serviciosVisibles = servicios.slice(0, 4);
    return (
      <div className="flex flex-wrap gap-1">
        {serviciosVisibles.map((servicio) => {
          const servicioInfo = serviciosDisponibles.find(s => s.value === servicio);
          return servicioInfo ? (
            <span key={`servicio-${servicio}`} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              {servicioInfo.icon}
              {servicioInfo.label}
            </span>
          ) : (
            <span key={`servicio-${servicio}`} className="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs">
              {servicio}
            </span>
          );
        })}
        {servicios.length > 4 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
            +{servicios.length - 4} más
          </span>
        )}
      </div>
    );
  };

  // Obtener cabañas
  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      let cabs = Array.isArray(data) ? data : [];
      if (!Array.isArray(data) && Array.isArray(data.data)) {
        cabs = data.data;
      }
      setCabanas(cabs);
    } catch (err) {
      console.log("Error al obtener cabañas: " + err.message);
    }
  };
  const obtenerCategorias = async () => {
    try {
      const data = await categorizacionService.getAll();
      // Soporta respuesta tipo {data: [...]} o array directa
      let cats = Array.isArray(data) ? data : [];
      if (!Array.isArray(data) && Array.isArray(data.data)) {
        cats = data.data;
      }
      setCategorias(cats);
    } catch (err) {
      console.log("Error", "Error al obtener categorías: " + err.message);
    }
  };
  useEffect(() => {
    obtenerCabanas();
    obtenerCategorias();
  }, []);

  const handleCreate = () => {
    setModoEdicion(false);
    setCabanaSeleccionada(null);
    setNuevaCabana({
      nombre: '',
      descripcion: '',
      capacidad: '',
      precio: '',
      categoria: '',
      estado: 'disponible',
      servicios: []
    });
    setSelectedImages([]);
    setMostrarModal(true);
  };

  const handleEdit = (cabana) => {
    setModoEdicion(true);
    setCabanaSeleccionada(cabana);
    setMostrarModal(true);
  };

  // Funciones para el modal del Dashboard
  const crearCabana = async (payload) => {
    // Soporta recibir event (desde submit directo) o un payload (FormData u objeto)
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevaCabana;
      await cabanaService.create(body);
      mostrarAlerta("¡Éxito!", "Cabaña creada exitosamente", 'success');
      setMostrarModal(false);
      obtenerCabanas();
    } catch (error) {
      mostrarAlerta("ERROR", `Error al crear cabaña: ${error.message}`, 'error');
    }
  };

  const actualizarCabana = async (payload) => {
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevaCabana;
      const id = (body && body._id) ? body._id : (cabanaSeleccionada && cabanaSeleccionada._id);
      if (!id) {
        mostrarAlerta('ERROR', 'No se encontró el ID de la cabaña a actualizar', 'error');
        return;
      }
      await cabanaService.update(id, body);
      mostrarAlerta("¡Éxito!", "Cabaña actualizada exitosamente", 'success');
      setMostrarModal(false);
      obtenerCabanas();
    } catch (error) {
      mostrarAlerta("ERROR", `Error al actualizar cabaña: ${error.message}`, 'error');
    }
  };

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 6;
  const totalPaginas = Math.ceil(cabanasFiltradas.length / registrosPorPagina);
  const cabanasPaginadas = cabanasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambia el filtro de usuarios
  useEffect(() => {
    setPaginaActual(1);
  }, [cabanasFiltradas]);

  return (
    <>
      <Header />
      <main className="main-content-tesorero">
        <div className="page-header-tesorero">
          <div className="card-header-tesorero">
            <button className="back-btn-tesorero" onClick={() => globalThis.history.back()}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="page-title-tesorero">
              <h1>Gestión de Cabañas</h1>
              <p>Administra reservas y disponibilidad de cabañas</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i> {' '}
            Nueva Cabaña
          </button>
        </div>
        <div className="stats-grid-solicitudes">
          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">4</div>
              <div className="stat-label-solicitudes">Total Cabañas</div>
            </div>
            <div className="stat-icon-solicitudes purple">
              <i className="fas fa-home"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">1</div>
              <div className="stat-label-solicitudes">Disponibles</div>
            </div>
            <div className="stat-icon-solicitudes orange">
              <i className="fas fa-check-circle"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">1</div>
              <div className="stat-label-solicitudes">Ocupadas</div>
            </div>
            <div className="stat-icon-solicitudes green">
              <i className="fas fa-users"></i>
            </div>
          </div>

          <div className="stat-card-solicitudes">
            <div className="stat--solicitudes">
              <div className="stat-number-solicitudes">2</div>
              <div className="stat-label-solicitudes">En Mantenimiento</div>
            </div>
            <div className="stat-icon-solicitudes red">
              <i className="fas fa-tools"></i>
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


        {/* Lista de Cabañas */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {
            if (cargando) {
              return (
                <div className="col-span-full text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600">Cargando cabañas...</p>
                </div>
              );
            }
            
            if (cabanasFiltradas.length > 0) {
              return cabanasPaginadas.map((cabana) => {
              const tipoCabana = obtenerTipoCabana(cabana.tipo);
              // Definir variables dentro del map
              const imagenes = Array.isArray(cabana.imagen) ? cabana.imagen : [];
              const imgIndex = imgIndices[cabana._id] || 0;
              // Determinar clases para el estado
              let estadoClases = 'bg-gray-500/90 text-white';
              if (cabana.estado === 'disponible') {
                estadoClases = 'bg-emerald-500/90 text-white';
              } else if (cabana.estado === 'ocupada') {
                estadoClases = 'bg-red-500/90 text-white';
              } else if (cabana.estado === 'mantenimiento') {
                estadoClases = 'bg-amber-500/90 text-white';
              }

              return (
                <div key={cabana._id} className="glass-card rounded-2xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Imagen principal */}
                  <div className="relative h-64 bg-gradient-to-r from-emerald-500 to-blue-600">
                    {imagenes.length > 0 ? (
                      <>
                        <img
                          src={imagenes[imgIndex]}
                          alt={cabana.nombre}
                          className="w-full h-64 object-cover"
                          style={{ borderRadius: '1rem' }}
                        />
                        {imagenes.length > 1 && (
                          <>
                            <button
                              onClick={() => prevImg(cabana._id, imagenes)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                              style={{ zIndex: 2 }}
                            >
                              {"<"}
                            </button>
                            <button
                              onClick={() => nextImg(cabana._id, imagenes)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                              style={{ zIndex: 2 }}
                            >
                              {">"}
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {imagenes.map((_, idx) => (
                                <span
                                  key={`indicator-${cabana._id}-${idx}`}
                                  className={`inline-block w-2 h-2 rounded-full ${imgIndex === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center w-full h-64 text-white text-4xl">
                        <span>{tipoCabana.icon}</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-white/90 text-slate-800 text-xs font-medium rounded-full">
                        {tipoCabana.label}
                      </span>
                      {cabana.destacada && (
                        <span className="px-3 py-1 bg-yellow-500/90 text-white text-xs font-medium rounded-full flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Destacada
                        </span>
                      )}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${estadoClases}`}>
                        {cabana.estado}
                      </span>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex  justify-end  gap-2  px-6 py-3 ">
                      <button
                        onClick={() => abrirModalVer(cabana)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(cabana)}
                        className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors "
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                    </div>
                  </div>

                  {/* Contenido de la cabaña */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800 line-clamp-2 mb-2">{cabana.nombre}</h3>
                      <p className="text-slate-600 text-sm line-clamp-3">{cabana.descripcion}</p>
                    </div>

                    <div className="space-y-3">
                      {/* Capacidad y habitaciones */}
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-slate-600">Hasta {cabana.capacidadMaxima} personas</span>
                        </div>
                        {cabana.numeroCuartos && (
                          <div className="flex items-center space-x-1">
                            <Home className="w-4 h-4 text-green-600" />
                            <span className="text-slate-600">{cabana.numeroCuartos} cuarto(s)</span>
                          </div>
                        )}
                      </div>

                      {/* Ubicación */}
                      {cabana.ubicacion && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-red-600" />
                          <span className="text-slate-600 line-clamp-1">{cabana.ubicacion}</span>
                        </div>
                      )}

                      {/* Precios */}
                      <div className="space-y-1">
                        {cabana.precioPorNoche && (
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-emerald-600">
                              {formatearPrecio(cabana.precioPorNoche)} / noche
                            </span>
                          </div>
                        )}
                        {cabana.precioPorPersona && (
                          <div className="flex items-center space-x-2 text-sm ml-6">
                            <span className="text-slate-600">
                              {formatearPrecio(cabana.precioPorPersona)} / persona
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Servicios principales */}
                      {cabana.servicios && cabana.servicios.length > 0 && renderServicios(cabana.servicios)}

                      {/* Disponibilidad */}
                      <div className="pt-3 border-t border-slate-200/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Disponibilidad:</span>
                          <span className={`flex items-center text-sm font-medium ${cabana.disponibilidad ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                            {cabana.disponibilidad ? (
                              <><Check className="w-4 h-4 mr-1" /> Disponible</>
                            ) : (
                              <><X className="w-4 h-4 mr-1" /> No Disponible</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
            }
            
            return (
              <div className="col-span-full text-center py-12">
                <Home className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay cabañas</h3>
                <p className="text-slate-500 mb-6">Comienza agregando tu primera cabaña o alojamiento</p>
                <button
                  onClick={handleCreate}
                  className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2 inline" />
                  Crear Cabaña
                </button>
              </div>
            );
          })()}
        </div>
        {mostrarModalDetalle && eventoDetalle && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                onClick={() => setMostrarModalDetalle(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">{eventoDetalle.nombre}</h2>
              <p className="mb-2"><strong>Descripción:</strong> {eventoDetalle.descripcion}</p>
              <p className="mb-2"><strong>Categoría:</strong> {eventoDetalle.categoria?.nombre || eventoDetalle.categoria}</p>
              <p className="mb-2"><strong>Capacidad:</strong> {eventoDetalle.capacidad}</p>
              <p className="mb-2"><strong>Precio:</strong> ${eventoDetalle.precio}</p>
              <p className="mb-2"><strong>Ubicación:</strong> {eventoDetalle.ubicacion}</p>
              <p className="mb-2"><strong>Estado:</strong> {eventoDetalle.estado}</p>
              <p className="mb-2"><strong>Creado por:</strong> {eventoDetalle.creadoPor?.nombre || eventoDetalle.creadoPor}</p>
              <div className="flex flex-wrap gap-2 my-4">
                {Array.isArray(eventoDetalle.imagen) && eventoDetalle.imagen.length > 0 ? (
                  eventoDetalle.imagen.map((img, idx) => (
                    <img
                      key={`detalle-img-${eventoDetalle._id || eventoDetalle.id || 'default'}-${idx}`}
                      src={img}
                      alt={`Imagen ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  ))
                ) : (
                  <span className="text-gray-400">Sin imágenes</span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                <span>Creado: {eventoDetalle.createdAt ? new Date(eventoDetalle.createdAt).toLocaleString() : "N/A"}</span>
                <span className="ml-4">Actualizado: {eventoDetalle.updatedAt ? new Date(eventoDetalle.updatedAt).toLocaleString() : "N/A"}</span>
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

        {mostrarModal && (
            <CabanaModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            cabanaSeleccionada={cabanaSeleccionada}
            setCabanaSeleccionada={setCabanaSeleccionada}
            nuevaCabana={nuevaCabana}
            setNuevaCabana={setNuevaCabana}
            onClose={() => setMostrarModal(false)}
              onSubmit={modoEdicion ? actualizarCabana : crearCabana}
            categorias={categorias}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        )}

        <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
          <button
            className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="pagination-info-admin">
            Página {paginaActual} de {totalPaginas || 1}
          </span>
          <button
            className="pagination-btn-admin"
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Gestioncabana;