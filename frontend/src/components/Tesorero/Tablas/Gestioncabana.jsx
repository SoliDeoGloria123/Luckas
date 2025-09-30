import React, { useState, useEffect } from 'react';
import { cabanaService } from '../../../services/cabanaService';
import { categorizacionService } from '../../../services/categorizacionService';
import { useNavigate } from "react-router-dom";
import { mostrarAlerta } from '../../utils/alertas';
import CabanaModal from '../modal/CabanaModal';
import Header from '../Header/Header-tesorero';
import Footer from '../../footer/Footer';
import {
  Plus,
  Edit,
  Trash2,
  Search,
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

  // Modal de edición
  const onEditar = (cabana) => {
    setModalCabana('edit');
    setCurrentItem(cabana);
    setShowModal(true);
  };

  // Modal de detalle (puedes implementar si lo necesitas)
  const onVerDetalle = (cabana) => {
    mostrarAlerta('Detalle', `Cabaña: ${cabana.nombre}`);
  };

  // Eliminar cabaña (puedes implementar lógica real)
  const onEliminar = (cabana) => {
    mostrarAlerta('Eliminar', `¿Seguro que deseas eliminar la cabaña?`);
  };

  // Insertar cabaña desde el botón vacío
  const onInsertar = () => {
    setModalCabana('create');
    setCurrentItem(null);
    setShowModal(true);
  };
  const [cabanas, setCabanas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const cabanasFiltradas = cabanas;
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalCabana] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);




  const ataras = () => {
    navigate('/tesorero');
  };

  // Obtener cabañas
  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      let cabs = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setCabanas(cabs);
    } catch (err) {
      console.log("Error al obtener cabañas: " + err.message);
    }
  };
  const obtenerCategorias = async () => {
    try {
      const data = await categorizacionService.getAll();
      // Soporta respuesta tipo {data: [...]} o array directa
      let cats = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setCategorias(cats);
    } catch (err) {
      console.log("Error", "Error al obtener categorías: " + err.message);
    }
  };
  useEffect(() => {
    obtenerCabanas();
    obtenerCategorias();
  }, []);

  const handleSubmit = async (data) => {
    if (modalMode === 'create') {
      try {
        await cabanaService.create(data);
        mostrarAlerta("¡Éxito!", "Cabaña creada exitosamente")
        obtenerCabanas();
      } catch (error) {
        mostrarAlerta("Error", "Error al crear la cabaña: " + error.message, "error");
      }
    } else {
      try {
        await cabanaService.update(currentItem._id, data);
        mostrarAlerta("¡Éxito!", "Cabaña actualizada exitosamente");
        obtenerCabanas();
      } catch (err) {
        mostrarAlerta("Error", "Error al actualizar cabaña: " + err.message);
      }
    }
  };


  const handleCreate = () => {
    setModalCabana('create');
    setCurrentItem(null);
    setShowModal(true);
  };

  const handleDeleteCabana = async (id) => {
    if (!id) return;
    if (!window.confirm('¿Seguro que deseas eliminar esta cabaña?')) return;
    try {
      await cabanaService.delete(id);
      mostrarAlerta('¡Éxito!', 'Cabaña eliminada exitosamente');
      obtenerCabanas();
    } catch (err) {
      mostrarAlerta('Error', 'Error al eliminar cabaña: ' + err.message);
    }
  };

  return (
    <>
    <Header/>
    <main className="main-content-tesorero">
      <div className="page-header-tesorero">
        <div className="card-header-tesorero">
          <button className="back-btn-tesorero" onClick={ataras}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="page-title-tesorero">
            <h1>Gestión de Cabañas</h1>
            <p>Administra reservas y disponibilidad de cabañas</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
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
            <i class="fas fa-users"></i>
          </div>
        </div>

        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">2</div>
            <div className="stat-label-solicitudes">En Mantenimiento</div>
          </div>
          <div className="stat-icon-solicitudes red">
            <i class="fas fa-tools"></i>
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
        {cargando ? (
          <div className="col-span-full text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando cabañas...</p>
          </div>
        ) : cabanasFiltradas.length > 0 ? (
          cabanasFiltradas.map((cabana) => {
            const tipoCabana = obtenerTipoCabana(cabana.tipo);
            // Definir variables y funciones dentro del map
            const imagenes = Array.isArray(cabana.imagen) ? cabana.imagen : [];
            const imgIndex = imgIndices[cabana._id] || 0;
            const prevImg = () => {
              setImgIndices(prev => ({
                ...prev,
                [cabana._id]: prev[cabana._id] > 0 ? prev[cabana._id] - 1 : imagenes.length - 1
              }));
            };
            const nextImg = () => {
              setImgIndices(prev => ({
                ...prev,
                [cabana._id]: prev[cabana._id] < imagenes.length - 1 ? prev[cabana._id] + 1 : 0
              }));
            };
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
                            onClick={prevImg}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-blue-700 rounded-full p-2 shadow hover:bg-white"
                            style={{ zIndex: 2 }}
                          >
                            {"<"}
                          </button>
                          <button
                            onClick={nextImg}
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
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${cabana.estado === 'disponible'
                      ? 'bg-emerald-500/90 text-white'
                      : cabana.estado === 'ocupada'
                        ? 'bg-red-500/90 text-white'
                        : cabana.estado === 'mantenimiento'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-gray-500/90 text-white'
                      }`}>
                      {cabana.estado}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex  justify-end  gap-2  px-6 py-3 ">
                    <button
                    onClick={() => onVerDetalle(cabana)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditar(cabana)}
                      className="p-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors "
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEliminar(cabana)}
                      className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
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
                    <div className="flex flex-wrap gap-2">
                      {cabana.servicios?.slice(0, 4).map((servicio) => {
                        const servicioInfo = serviciosDisponibles.find(s => s.value === servicio);
                        return servicioInfo ? (
                          <span key={servicio} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg">
                            {servicioInfo.icon}
                            <span className="ml-1">{servicioInfo.label}</span>
                          </span>
                        ) : null;
                      })}
                      {cabana.servicios?.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                          +{cabana.servicios.length - 4} más
                        </span>
                      )}
                    </div>

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
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <Home className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay cabañas</h3>
            <p className="text-slate-500 mb-6">Comienza agregando tu primera cabaña o alojamiento</p>
            <button
              onClick={onInsertar}
              className="btn-premium px-6 py-3 text-white rounded-xl font-medium shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2 inline" />
              Crear Cabaña
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <CabanaModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          categorias={categorias}
        />
      )}
    </main>
    <Footer/>
    </>
  );
};

export default Gestioncabana;