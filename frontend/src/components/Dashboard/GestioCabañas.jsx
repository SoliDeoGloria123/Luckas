import React, { useState, useEffect } from "react";
import { cabanaService } from "../../services/cabanaService";
import { categorizacionService } from "../../services/categorizacionService";
import CabanaTabla from "./Tablas/CabanaTabla";
import CabanaModal from "./Modales/CabanaModal";
import defaultCabana from './Modales/common/defaultCabana';
import manejarOperacionAsync from './common/manejarOperacionAsync';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import {
  Plus,
  X,
  Search,
  Home,
  Check,
  Users,
  AlertCircle,
} from 'lucide-react';
import PropTypes from 'prop-types';




const GestioCabañas = ({ readOnly = false, modoTesorero = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [cabanas, setCabanas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({ busqueda: '', categoria: 'todos', estado: 'todos' });
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [eventoDetalle, setEventoDetalle] = useState(null);
  const [mostrarModalDetalle, setMostrarModalDetalle] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [nuevaCabana, setNuevaCabana] = useState({ ...defaultCabana });
  const [estadisticasCabanas, setEstadisticasCabanas] = useState({
    totalCabanas: 0,
    disponibles: 0,
    ocupadas: 0,
    mantenimiento: 0,
    capacidadTotal: 0,
    precioPromedio: 0,
  });


  // Se usa helper compartido `manejarOperacionAsync` importado arriba

  useEffect(() => {
    obtenerCabanas();
    obtenerCategorias();
    obtenerEstadisticas();
  }, []);

  const obtenerCabanas = () => manejarOperacionAsync(
    () => cabanaService.getAll(),
    setCabanas,
    "Error al obtener cabañas"
  );

  const obtenerCategorias = () => manejarOperacionAsync(
    () => categorizacionService.getAll(),
    setCategorias,
    "Error al obtener categorías"
  );

  const obtenerEstadisticas = async () => {
    try {
      const stats = await cabanaService.getEstadisticasGenerales();
      // La API devuelve un objeto con las métricas. Algunos servicios devuelven { success,data } o un objeto directo.
      let payload = stats;
      if (stats && typeof stats === 'object' && !Array.isArray(stats)) {
        if (stats.data) {
          payload = stats.data;
        } else {
          payload = stats;
        }
      }
      setEstadisticasCabanas(payload || {});
    } catch (error) {
      console.error('Error al cargar estadísticas de cabañas:', error);
      mostrarAlerta('Error', 'No se pudieron obtener las estadísticas de cabañas: ' + (error.message || error), 'error');
    }
  };
  // CRUD
  const crearCabana = async () => {
    try {
      const formData = new FormData();
      formData.append("nombre", nuevaCabana.nombre);
      formData.append("descripcion", nuevaCabana.descripcion);
      formData.append("capacidad", nuevaCabana.capacidad);
      formData.append("categoria", nuevaCabana.categoria);
      formData.append("precio", nuevaCabana.precio);
      formData.append("estado", nuevaCabana.estado);
      formData.append("ubicacion", nuevaCabana.ubicacion);

      // Agregar imágenes seleccionadas
      for (const imgObj of selectedImages) {
        if (imgObj.file) formData.append('imagen', imgObj.file);
      }

      await cabanaService.create(formData);
      mostrarAlerta("¡Éxito!", "Cabaña creada exitosamente");
      setMostrarModal(false);
      setNuevaCabana({ ...defaultCabana });
      setSelectedImages([]);
      obtenerCabanas();
    } catch (error) {
      mostrarAlerta("Error", "Error al crear la cabaña: " + error.message, "error");
    }
  };

  const actualizarCabana = async () => {
    try {
      await cabanaService.update(cabanaSeleccionada._id, cabanaSeleccionada);
      mostrarAlerta("¡Éxito!", "Cabaña actualizada exitosamente");
      setMostrarModal(false);
      setCabanaSeleccionada(null);
      setModoEdicion(false);
      obtenerCabanas();
    } catch (err) {
      mostrarAlerta("Error", "Error al actualizar cabaña: " + err.message);
    }
  };

  const eliminarCabana = async (id) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción eliminará el usuario de forma permanente."
    );

    if (!confirmado) return;
    try {
      await cabanaService.delete(id);
      mostrarAlerta("¡Éxito!", "Cabaña eliminada exitosamente");
      obtenerCabanas();
    } catch (err) {
      mostrarAlerta("Error", "Error al eliminar cabaña: " + err.message);
    }
  };

  const abrirModalVer = (evento) => {
    setEventoDetalle(evento);
    setMostrarModalDetalle(true);
  };
  // Modal handlers
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevaCabana({ ...defaultCabana });
    setSelectedImages([]);
    setMostrarModal(true);
  };

  const abrirModalEditar = (cabana) => {
    setModoEdicion(true);
    setCabanaSeleccionada(cabana);
    setMostrarModal(true);
  };

  // Helpers para el carrusel de imágenes en el modal de detalle
  const getImagesFromDetalle = (detalle) => {
    if (!detalle) return [];
    if (Array.isArray(detalle.imagen)) return detalle.imagen;
    if (detalle.imagen) return [detalle.imagen];
    return [];
  };

  useEffect(() => {
    setCarouselIndex(0);
  }, [eventoDetalle]);

  // Search filter (filtra por nombre, descripción, categoría y estado según el modelo)
  const cabanasFiltradas = cabanas.filter(c => {
    const q = (filtros.busqueda || '').toString().trim().toLowerCase();

    // filtro por categoria (acepta población o id)
    if (filtros.categoria && filtros.categoria !== 'todos') {
      const catId = c.categoria?._id || c.categoria || '';
      if (String(catId) !== String(filtros.categoria)) return false;
    }

    // filtro por estado (según enum en modelo)
    if (filtros.estado && filtros.estado !== 'todos') {
      if ((c.estado || '') !== filtros.estado) return false;
    }

    if (!q) return true;
    const texto = `${c.nombre || ''} ${c.descripcion || ''} ${c.ubicacion || ''} ${c.precio || ''}`.toLowerCase();
    return texto.includes(q);
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 6;
  const totalPaginas = Math.ceil(cabanasFiltradas.length / registrosPorPagina);
  const cabanasPaginadas = cabanasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );



  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <Sidebar
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />
      <div className={`transition-all duration-300 ${sidebarAbierto ? 'ml-72' : 'ml-20'}`}>
        <Header
          sidebarAbierto={sidebarAbierto}
          setSidebarAbierto={setSidebarAbierto}
          seccionActiva={seccionActiva}
        />
        <div className="seccion-usuarios">
          <div className="page-header-Academicos">
            <div className="page-title-admin">
              <h1>Gestión de Cabañas</h1>
              <p >Administra las cabañas y alojamientos del seminario</p>
            </div>
            <button
              onClick={abrirModalCrear}
              className="btn-premium flex items-center space-x-2 px-4 py-2 text-white rounded-xl font-medium shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Cabaña</span>
            </button>
          </div>
          <div className="dashboard-grid-reporte-admin">
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin users">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticasCabanas.totalCabanas ?? 0}</h3>
                <p>Total Cabañas</p>
              </div>
            </div>

            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin active">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticasCabanas.disponibles ?? 0}</h3>
                <p>Disponibles</p>
              </div>
            </div>

            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin admins">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticasCabanas.ocupadas ?? 0}</h3>
                <p>Ocupadas</p>
              </div>
            </div>

            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin new">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticasCabanas.mantenimiento ?? 0}</h3>
                <p>Mantenimiento</p>
              </div>
            </div>
          </div>


                <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar cabañas..."
                    value={filtros.busqueda}
                    onChange={(e) => { setFiltros({ ...filtros, busqueda: e.target.value }); setPaginaActual(1); }}
                    className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <select
                  value={filtros.categoria}
                  onChange={(e) => { setFiltros({ ...filtros, categoria: e.target.value }); setPaginaActual(1); }}
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="todos">Todas las Categorías</option>
                  {categorias.map(cat => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.nombre || cat.nombreCategoria || cat.codigo || cat._id}</option>
                  ))}
                </select>

                <select
                  value={filtros.estado}
                  onChange={(e) => { setFiltros({ ...filtros, estado: e.target.value }); setPaginaActual(1); }}
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>

                <div className="text-sm text-slate-600 flex items-center">
                  <span className="font-medium">{cabanasFiltradas.length}</span> cabaña(s) encontrada(s)
                </div>
              </div>
            </div>
          {mostrarModalDetalle && eventoDetalle && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
                <div className="flex items-start justify-between p-6 border-b">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-800">{eventoDetalle.nombre}</h2>
                    <p className="text-sm text-slate-500 mt-1">{eventoDetalle.categoria?.nombre || eventoDetalle.categoria} • {eventoDetalle.ubicacion || ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${eventoDetalle.estado === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700'}`}>{eventoDetalle.estado || '—'}</span>
                    <button onClick={() => setMostrarModalDetalle(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-md"><X size={20} /></button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {/* Carrusel */}
                      {getImagesFromDetalle(eventoDetalle).length > 0 ? (
                        <div>
                          <div className="relative mb-3">
                            <img
                              src={getImagesFromDetalle(eventoDetalle)[carouselIndex]}
                              alt={`Imagen cabaña ${carouselIndex + 1}`}
                              className="w-full h-56 object-cover rounded-lg"
                            />
                            {getImagesFromDetalle(eventoDetalle).length > 1 && (
                              <>
                                <button
                                  onClick={() => setCarouselIndex(i => Math.max(i - 1, 0))}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                                  aria-label="Imagen anterior"
                                >◀</button>
                                <button
                                  onClick={() => setCarouselIndex(i => Math.min(i + 1, getImagesFromDetalle(eventoDetalle).length - 1))}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                                  aria-label="Imagen siguiente"
                                >▶</button>
                              </>
                            )}
                          </div>

                          <div className="flex gap-2">
                            {getImagesFromDetalle(eventoDetalle).map((img) => (
                              <button
                                key={typeof img === 'string' ? img : (img?.name || String(img))}
                                type="button"
                                onClick={() => setCarouselIndex(getImagesFromDetalle(eventoDetalle).indexOf(img))}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCarouselIndex(getImagesFromDetalle(eventoDetalle).indexOf(img)); } }}
                                aria-label={`Mostrar imagen`}
                                className={`p-0 border-0 bg-transparent ${getImagesFromDetalle(eventoDetalle).indexOf(img) === carouselIndex ? 'ring-2 ring-blue-500 rounded' : ''}`}
                              >
                                <img
                                  src={typeof img === 'string' ? img : img?.url || ''}
                                  alt={`Thumb`}
                                  className="w-20 h-14 object-cover rounded cursor-pointer"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-56 flex items-center justify-center bg-slate-100 rounded-lg mb-3 text-sm text-slate-500">Sin imágenes</div>
                      )}

                      <p className="text-sm text-slate-700 leading-relaxed mt-4">{eventoDetalle.descripcion || 'Sin descripción'}</p>
                    </div>

                    <div>
                      <ul className="mt-2 text-sm text-slate-700 space-y-2">
                        <li><strong className="text-slate-800">Capacidad:</strong> {eventoDetalle.capacidad ?? '—'}</li>
                        <li><strong className="text-slate-800">Precio:</strong> ${eventoDetalle.precio ?? 0}</li>
                        <li><strong className="text-slate-800">Ubicación:</strong> {eventoDetalle.ubicacion || '—'}</li>
                        <li><strong className="text-slate-800">Estado:</strong> {eventoDetalle.estado || '—'}</li>
                        <li><strong className="text-slate-800">Creado por:</strong> {eventoDetalle.creadoPor?.nombre || eventoDetalle.creadoPor || '—'}</li>
                        <li><strong className="text-slate-800">Creado:</strong> {eventoDetalle.createdAt ? new Date(eventoDetalle.createdAt).toLocaleString() : '—'}</li>
                        <li><strong className="text-slate-800">Actualizado:</strong> {eventoDetalle.updatedAt ? new Date(eventoDetalle.updatedAt).toLocaleString() : '—'}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t flex justify-end">
                  <button
                    onClick={() => setMostrarModalDetalle(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}


          <CabanaTabla
            cabanas={cabanasPaginadas}
            onEditar={canEdit && !readOnly ? abrirModalEditar : null}
            onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarCabana : null}
            onVerDetalle={abrirModalVer}
            onInsertar={abrirModalCrear}
            nuevaCabana={nuevaCabana}
            setNuevaCabana={setNuevaCabana}
          />
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

          <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
            <button
              className="pagination-btn-admin"
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="pagination-info-admin">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              className="pagination-btn-admin"
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

GestioCabañas.propTypes = {
  readOnly: PropTypes.bool,
  modoTesorero: PropTypes.bool,
  canCreate: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool
};
export default GestioCabañas;
