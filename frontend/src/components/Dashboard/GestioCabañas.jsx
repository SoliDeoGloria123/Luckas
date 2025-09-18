import React, { useState, useEffect } from "react";
import { cabanaService } from "../../services/cabanaService";
import { categorizacionService } from "../../services/categorizacionService";
import CabanaTabla from "./Tablas/CabanaTabla";
import CabanaModal from "./Modales/CabanaModal";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';

const GestioCabañas = ({ readOnly = false, modoTesorero = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [cabanas, setCabanas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [nuevaCabana, setNuevaCabana] = useState({
    nombre: "",
    descripcion: "",
    capacidad: "",
    categoria: "",
    precio: "",
    estado: "disponible",
    imagen: "",
    ubicacion: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerCabanas();
    obtenerCategorias();
  }, []);

  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      // Soporta respuesta tipo {data: [...]} o array directa
      let cabs = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setCabanas(cabs);
    } catch (err) {
      setError("Error al obtener cabañas: " + err.message);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const data = await categorizacionService.getAll();
      // Soporta respuesta tipo {data: [...]} o array directa
      let cats = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setCategorias(cats);
    } catch (err) {
      setError("Error", "Error al obtener categorías: " + err.message);
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

      if (Array.isArray(nuevaCabana.imagen)) {
        nuevaCabana.imagen.forEach(imagen => {
          formData.append("imagen", imagen);
        });
      }
      await cabanaService.create(formData);
      mostrarAlerta("¡Éxito!", "Cabaña creada exitosamente");
      setMostrarModal(false);
      setNuevaCabana({
        nombre: "",
        descripcion: "",
        capacidad: "",
        categoria: "",
        precio: "",
        estado: "disponible",
        imagen: [],
        ubicacion: ""
      });
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

  // Modal handlers
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevaCabana({
      nombre: "",
      descripcion: "",
      capacidad: "",
      categoria: "",
      precio: "",
      estado: "disponible",
      imagen: "",
      ubicacion: ""
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (cabana) => {
    setModoEdicion(true);
    setCabanaSeleccionada(cabana);
    setMostrarModal(true);
  };

  // Search filter
  const cabanasFiltradas = cabanas.filter(c => {
    const texto = `${c.nombre} ${c.descripcion} ${c.estado}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const [modalImagen, setModalImagen] = useState({ abierto: false, imagenes: [], actual: 0 });

  const handleVerImagenes = (imagenes) => {
    if (Array.isArray(imagenes) && imagenes.length > 0) {
      setModalImagen({ abierto: true, imagenes, actual: 0 });
    }
  };

  const handleNext = () => {
    setModalImagen(prev => ({
      ...prev,
      actual: (prev.actual + 1) % prev.imagenes.length
    }));
  };

  const handlePrev = () => {
    setModalImagen(prev => ({
      ...prev,
      actual: (prev.actual - 1 + prev.imagenes.length) % prev.imagenes.length
    }));
  };

  const cerrarModalImagen = () => {
    setModalImagen({ abierto: false, imagenes: [], actual: 0 });
  };
  return (
<<<<<<< Updated upstream
    <div className="seccion-usuarios">
      <div className="page-header-Academicos">
        <div className="page-title-admin">
          <h1>Gestión de Cabañas</h1>
          <p>Administra las cuentas de usuario del sistema</p>
        </div>
        {canCreate && !readOnly && (
          <button className="btn-admin btn-primary-admin" onClick={abrirModalCrear}>
            + Nueva Cabaña
          </button>
        )}
      </div>
       <div className="stats-grid-admin">
                <div className="stat-card-admin">
                  <div className="stat-icon-admin users">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info-admin">
                    <h3>5</h3>
                    <p>Total Usuarios</p>
                  </div>
                </div>
                <div className="stat-card-admin">
                  <div className="stat-icon-admin active">
                    <i className="fas fa-user-check"></i>
                  </div>
                  <div className="stat-info-admin">
                    <h3>4</h3>
                    <p>Usuarios Activos</p>
                  </div>
                </div>
                <div className="stat-card-admin">
                  <div className="stat-icon-admin admins">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="stat-info-admin">
                    <h3>1</h3>
                    <p>Administradores</p>
                  </div>
                </div>
                <div className="stat-card-admin">
                  <div className="stat-icon-admin new">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <div className="stat-info-admin">
                    <h3>12</h3>
                    <p>Nuevos Este Mes</p>
                  </div>
                </div>
              </div>
      <section className="filtros-section-admin">
        <div className="busqueda-contenedor">
          <i class="fas fa-search"></i>
          <input
            type="text"
            placeholder="Buscar Cabaña..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="input-busqueda"
=======
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
          <div className="p-9 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gestión de Cabañas</h1>
              <p className="text-slate-600">Administra las cabañas y alojamientos del seminario</p>
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
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info-admin">
                <h3>5</h3>
                <p>Total Usuarios</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin active">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="stat-info-admin">
                <h3>4</h3>
                <p>Usuarios Activos</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin admins">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="stat-info-admin">
                <h3>1</h3>
                <p>Administradores</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin new">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="stat-info-admin">
                <h3>12</h3>
                <p>Nuevos Este Mes</p>
              </div>
            </div>
          </div>

          {modalImagen.abierto && (
            <div className="modal-overlay-admin" onClick={cerrarModalImagen}>
              <div className="modal-imagines modal-imagines" onClick={(e) => e.stopPropagation()}>
                <button className="btn-cerrar" onClick={cerrarModalImagen}>✖</button>
                <button className="btn-flecha izquierda" onClick={handlePrev}>◀</button>
                <img
                  src={`http://localhost:3000/uploads/cabanas/${modalImagen.imagenes[modalImagen.actual]}`}
                  alt="Imagen de la cabaña"
                  className="imagen-modal"
                />
                <button className="btn-flecha derecha" onClick={handleNext}>▶</button>
              </div>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <CabanaTabla
            cabanas={cabanasFiltradas}
            onEditar={canEdit && !readOnly ? abrirModalEditar : null}
            onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarCabana : null}
            onVerImagen={handleVerImagenes}
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
>>>>>>> Stashed changes
          />
        </div>
        <div className="filtro-grupo-admin">
          <select className="filtro-dropdown">
            <option>Todos los Roles</option>
            <option>Administrador</option>
            <option>Seminarista</option>
            <option>Tesorero</option>
            <option>Usuario Externo</option>
          </select>
          <select className="filtro-dropdown">
            <option>Todos los Estados</option>
            <option>Activo</option>
            <option>Inactivo</option>
            <option>Pendiente</option>
          </select>
        </div>
        {modalImagen.abierto && (
          <div className="modal-overlay-admin" onClick={cerrarModalImagen}>
            <div className="modal-imagines modal-imagines" onClick={(e) => e.stopPropagation()}>
              <button className="btn-cerrar" onClick={cerrarModalImagen}>✖</button>
              <button className="btn-flecha izquierda" onClick={handlePrev}>◀</button>
              <img
                src={`http://localhost:3000/uploads/cabanas/${modalImagen.imagenes[modalImagen.actual]}`}
                alt="Imagen de la cabaña"
                className="imagen-modal"
              />
              <button className="btn-flecha derecha" onClick={handleNext}>▶</button>
            </div>
          </div>
        )}
      </section>
      {error && <div className="error-message">{error}</div>}
        <CabanaTabla
          cabanas={cabanasFiltradas}
          onEditar={canEdit && !readOnly ? abrirModalEditar : null}
          onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarCabana : null}
          onVerImagen={handleVerImagenes}
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
      />
    </div>
  );
};

export default GestioCabañas;
