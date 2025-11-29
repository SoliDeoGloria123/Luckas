import { useState, useEffect } from "react";
import { inscripcionService } from "../../services/inscripcionService";
import { eventService } from "../../services/eventService";
import { categorizacionService } from "../../services/categorizacionService";
import { programasAcademicosService } from "../../services/programasAcademicosService";
import TablaInscripciones from "./Tablas/InscripcionTabla";
import InscripcionModal from "./Modales/InscripcionModa";
import useBusqueda from "./Busqueda/useBusqueda";
import { Search } from 'lucide-react';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';


const GestionIscripcion = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [programas, setProgramas] = useState([]); // 1. Estado para programas
  const [estadisticas, setEstadisticas] = useState({ totalInscripciones: 0, nuevasEstaSemana: 0, aprobadas: 0, pendientes: 0 });
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  // Filtros UI
  const [filtroEvento, setFiltroEvento] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroTipoReferencia, setFiltroTipoReferencia] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const {
    busqueda: busquedaInscripciones,
    setBusqueda: setBusquedaInscripciones,
    datosFiltrados: inscripcionesFiltradas
  } = useBusqueda(
    inscripciones,
    [
      "nombre",
      "apellido",
      "numeroDocumento", // Búsqueda por cédula desde inscripción
      "usuario.numeroDocumento", // Búsqueda por cédula desde usuario poblado
      "correo",
      "usuario.correo",
      "telefono",
      "usuario.telefono",
      "evento.nombre",
      "categoria.nombre"
    ]
  );

  // Función utilitaria para manejo de datos con try/catch
  const manejarOperacionAsync = async (operacion, setEstado, valorPorDefecto = [], mensajeError = "No se pudieron obtener los datos") => {
    try {
      const data = await operacion();
      const datos = data.data || data;
      setEstado(Array.isArray(datos) ? datos : valorPorDefecto);
    } catch (error) {
      setEstado(valorPorDefecto);
      mostrarAlerta("Error", `${mensajeError}: ${error.message}`);
    }
  };

  // Función utilitaria para manejo de operaciones CRUD
  const ejecutarOperacionCRUD = async (operacion, mensajeExito, mensajeError, callback = null) => {
    try {
      await operacion();
      mostrarAlerta("¡Éxito!", mensajeExito);
      if (callback) callback();
    } catch (error) {
      console.error(mensajeError, error.response?.data || error.message);
      mostrarAlerta("Error", `${mensajeError}: ${error.response?.data?.message || error.message}`);
    }
  };

  // Función utilitaria para configuración de modales
  const configurarModal = (esEdicion, item = null) => {
    setModoEdicion(esEdicion);
    setInscripcionSeleccionada(esEdicion ? { ...item } : null);
    setMostrarModal(true);
  };


  // Obtener inscripciones
  const obtenerInscripciones = () => manejarOperacionAsync(
    () => inscripcionService.getAll(),
    setInscripciones,
    [],
    "No se pudieron obtener las inscripciones"
  );

  // Obtener eventos
  const obtenerEventos = () => manejarOperacionAsync(
    () => eventService.getAllEvents(),
    setEventos,
    [],
    "No se pudieron obtener los eventos"
  );

  // Obtener categorías
  const obtenerCategorias = () => manejarOperacionAsync(
    () => categorizacionService.getAll(),
    setCategorias,
    [],
    "No se pudieron obtener las categorías"
  );
  // Obtener programas académicos
  const obtenerProgramas = () => manejarOperacionAsync(
    () => programasAcademicosService.getAllProgramas(),
    setProgramas,

    [],
    "No se pudieron obtener los programas académicos"
  );

  useEffect(() => {
    obtenerInscripciones();
    obtenerEventos();
    obtenerCategorias();
    obtenerProgramas();
    // Obtener estadísticas generales al montar
    Estadisticagenerales();
  }, []);

  //obtener estadísticas generales
  const Estadisticagenerales = async () => {
    try {
      const data = await inscripcionService.gerEstadisticasGenerales();
      const payload = data?.data || {};
      setEstadisticas({
        totalInscripciones: payload.totalInscripciones || payload.total || 0,
        nuevasEstaSemana: payload.nuevasEstaSemana || payload.newThisWeek || 0,
        aprobadas: payload.aprobadas || payload.approved || 0,
        pendientes: payload.pendientes || payload.pending || 0,
      });
    } catch (error) {
      console.error("ERROR", `Error al obtener estadísticas generales: ${error.message}`);
    }
  };

  // Crear inscripción
  const crearInscripcion = async (payload) => {
    // Procesar payload
    const insc = { ...payload };
    if (!insc.solicitud || insc.solicitud === "") {
      delete insc.solicitud;
    }
    if (insc.edad) insc.edad = Number(insc.edad);
    if (insc.evento) {
      insc.referencia = insc.evento;
      delete insc.evento;
    }

    await ejecutarOperacionCRUD(
      () => inscripcionService.create(insc),
      "Inscripción creada exitosamente",
      "Error al crear la inscripción",
      () => {
        setMostrarModal(false);
        obtenerInscripciones();
      }
    );
  };

  // Actualizar inscripción
  const actualizarInscripcion = async (form) => {
    const usuarioId = typeof form.usuario === 'object' && form.usuario._id ? form.usuario._id : form.usuario;
    const payload = {
      usuario: usuarioId,
      tipoReferencia: form.tipoReferencia,
      referencia: form.referencia,
      categoria: form.categoria,
      estado: form.estado,
      observaciones: form.observaciones,
      nombre: form.nombre,
      tipoDocumento: form.tipoDocumento,
      numeroDocumento: form.numeroDocumento,
      telefono: form.telefono,
      edad: Number(form.edad),
      correo: form.correo,
      apellido: form.apellido,
    };

    await ejecutarOperacionCRUD(
      () => inscripcionService.update(inscripcionSeleccionada._id, payload),
      "Inscripción actualizada exitosamente",
      "Error al actualizar la inscripción",
      () => {
        setMostrarModal(false);
        setInscripcionSeleccionada(null);
        setModoEdicion(false);
        obtenerInscripciones();
      }
    );
  };

  // Eliminar inscripción
  const eliminarInscripcion = async (id) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción eliminará el usuario de forma permanente."
    );

    if (!confirmado) return;

    await ejecutarOperacionCRUD(
      () => inscripcionService.delete(id),
      "Inscripción eliminada exitosamente",
      "Error al eliminar la inscripción",
      obtenerInscripciones
    );
  };

  // Abrir modal para crear
  const abrirModalCrear = () => configurarModal(false);
  // Abrir modal para editar
  const abrirModalEditar = (inscripcion) => configurarModal(true, inscripcion);

  // Paginación para inscripciones (aplicar filtros adicionales)
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const inscripcionesFiltradasPorFiltros = inscripcionesFiltradas.filter((item) => {
    // evento / referencia
    const refId = item.referencia && (item.referencia._id || item.referencia);
    const cumpleEvento = filtroEvento === 'todos' || String(refId) === String(filtroEvento);
    // categoria
    const catId = item.categoria && (item.categoria._id || item.categoria);
    const cumpleCategoria = filtroCategoria === 'todos' || String(catId) === String(filtroCategoria);
    // tipoReferencia
    const cumpleTipoRef = filtroTipoReferencia === 'todos' || String(item.tipoReferencia) === String(filtroTipoReferencia);
    // estado
    const cumpleEstado = filtroEstado === 'todos' || String(item.estado) === String(filtroEstado);
    return cumpleEvento && cumpleCategoria && cumpleTipoRef && cumpleEstado;
  });
  const totalPaginas = Math.ceil(inscripcionesFiltradasPorFiltros.length / registrosPorPagina);
  const inscripcionesPaginadas = inscripcionesFiltradasPorFiltros.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Resetear página al cambiar búsqueda o filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaInscripciones, filtroEvento, filtroCategoria, filtroTipoReferencia, filtroEstado]);
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
        <div className="space-y-7 fade-in-up p-9">
          <div className="page-header-Academicos">
            <div className="page-title-admin">
              <h1>Gestión de Inscripciones</h1>
              <p>Administra las cuentas de usuario del sistema</p>
            </div>
            <button className="btn-admin btn-primary-admin" onClick={abrirModalCrear}>
              + Nueva Inscripción
            </button>
          </div>

          <div className="dashboard-grid-reporte-admin">
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin users">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.totalInscripciones || 0}</h3>
                <p>Total Inscripciones</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin active">
                <i className="fas fa-calendar-plus"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.nuevasEstaSemana || 0}</h3>
                <p>Nuevas Esta Semana</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin admins">
                <i className="fas fa-check-double"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.aprobadas || 0}</h3>
                <p>Aprobadas</p>
              </div>
            </div>
            <div className="stat-card-reporte-admin">
              <div className="stat-icon-reporte-admin-admin new">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="stat-info-admin">
                <h3>{estadisticas.pendientes || 0}</h3>
                <p>Pendientes</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar inscripciones..."
                  value={busquedaInscripciones}
                  onChange={(e) => { setBusquedaInscripciones(e.target.value); setPaginaActual(1); }}
                  className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                />
              </div>
              <div className="flex space-x-3">
                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroEvento}
                  onChange={(e) => { setFiltroEvento(e.target.value); setPaginaActual(1); }}
                >
                  <option value="todos">Todos los eventos/programas</option>
                  {Array.isArray(eventos) && eventos.map(ev => (
                    <option key={ev._id || ev.id} value={ev._id || ev.id}>{ev.nombre || ev.titulo}</option>
                  ))}
                </select>

                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroCategoria}
                  onChange={(e) => { setFiltroCategoria(e.target.value); setPaginaActual(1); }}
                >
                  <option value="todos">Todas las categorías</option>
                  {Array.isArray(categorias) && categorias.map(cat => (
                    <option key={cat._id || cat.id || cat.codigo} value={cat._id || cat.id || cat.codigo}>{cat.nombre || cat.codigo}</option>
                  ))}
                </select>

                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroTipoReferencia}
                  onChange={(e) => { setFiltroTipoReferencia(e.target.value); setPaginaActual(1); }}
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="Eventos">Eventos</option>
                  <option value="ProgramaAcademico">ProgramaAcademico</option>
                </select>

                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroEstado}
                  onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="no inscrito">no inscrito</option>
                  <option value="inscrito">inscrito</option>
                  <option value="finalizado">finalizado</option>
                  <option value="preinscrito">preinscrito</option>
                  <option value="matriculado">matriculado</option>
                  <option value="en_curso">en_curso</option>
                  <option value="certificado">certificado</option>
                  <option value="rechazada">rechazada</option>
                  <option value="cancelada academico">cancelada academico</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-6 glass-card rounded-2xl border border-white/20 shadow-lg overflow-hidden user-card">
            <TablaInscripciones
              inscripciones={inscripcionesPaginadas}
              onEditar={abrirModalEditar}
              onEliminar={eliminarInscripcion}
            />
          </div>
      
          <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
            <button
              className="pagination-btn-admin"
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
            >
              <i className="fas fa-chevron-left"/>
            </button>
            <span className="pagination-info-admin">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              className="pagination-btn-admin"
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
            >
              <i className="fas fa-chevron-right"/>
            </button>
          </div>
        </div>
           <InscripcionModal
            mostrar={mostrarModal}
            modo={modoEdicion ? "editar" : "crear"}
            inscripcion={modoEdicion ? inscripcionSeleccionada : null}
            eventos={eventos}
            categorias={categorias}
            programas={programas}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicion ? actualizarInscripcion : crearInscripcion}
          />
      </div>
    </div>
  );
};

export default GestionIscripcion;
