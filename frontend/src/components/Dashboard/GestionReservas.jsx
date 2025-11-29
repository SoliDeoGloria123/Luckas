import React, { useState, useEffect } from "react";
import { Search, Calendar, CheckCircle, Clock, BarChart } from 'lucide-react';
import { reservaService } from "../../services/reservaService";
import { userService } from "../../services/userService";
import { cabanaService } from "../../services/cabanaService";
import TablaReservas from "./Tablas/ReservaTabla";
import ReservasModal from "./Modales/ReservaModal";
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import PropTypes from 'prop-types';
import manejarOperacionAsync from './common/manejarOperacionAsync';

const defaultReserva = {
  usuario: "",
  cabana: "",
  fechaInicio: "",
  fechaFin: "",
  precio: "",
  estado: "Pendiente",
  observaciones: "",
  nombre: "",
  apellido: "",
  tipoDocumento: "",
  numeroDocumento: "",
  correoElectronico: "",
  telefono: "",
  numeroPersonas: 1,
  activo: true
};

const GestionReservas = ({ readOnly = false, modoTesorero = false, canCreate = true, canEdit = true, canDelete = true }) => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [estadisticasReservas, setEstadisticasReservas] = useState({
    totalReservas: 0,
    activas: 0,
    pendientes: 0,
    confirmadas: 0,
    canceladas: 0,
    finalizadas: 0,
    nuevasEsteMes: 0,
  });
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroCabana, setFiltroCabana] = useState('todos');
  const [filtroUsuario, setFiltroUsuario] = useState('todos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [nuevaReserva, setNuevaReserva] = useState({ ...defaultReserva });
  const [error, setError] = useState("");

  // Usar helper compartido `manejarOperacionAsync` (se pasa `setError` para preservar comportamiento)

  useEffect(() => {
    obtenerReservas();
    obtenerUsuarios();
    obtenerCabanas();
    obtenerEstadisticasReservas();
  }, []);

  const obtenerReservas = () => manejarOperacionAsync(
    () => reservaService.getAll(),
    setReservas,
    "Error al obtener reservas",
    setError
  );

  const obtenerUsuarios = () => manejarOperacionAsync(
    () => userService.getAllUsers(),
    setUsuarios,
    "Error al obtener usuarios",
    setError
  );

  const obtenerCabanas = () => manejarOperacionAsync(
    () => cabanaService.getAll(),
    setCabanas,
    "Error al obtener cabañas",
    setError
  );

  const obtenerEstadisticasReservas = async () => {
    try {
      const stats = await reservaService.getEstadisticasGenerales();
      let payload = stats;
      if (stats && typeof stats === 'object' && !Array.isArray(stats)) {
        if (stats.data) {
          payload = stats.data;
        } else {
          payload = stats;
        }
      }
      setEstadisticasReservas(payload || {});
    } catch (error) {
      console.error('Error al obtener estadísticas de reservas:', error);
      mostrarAlerta('Error', 'No se pudieron cargar las estadísticas de reservas: ' + (error.message || error), 'error');
    }
  };

  const formatNumber = (v) => {
    try { return new Intl.NumberFormat('es-ES').format(Number(v || 0)); } catch { return v; }
  };

  // CRUD
  const crearReserva = async () => {
    try {
      // Forzar activo a booleano
      const reservaData = { ...nuevaReserva };
      if (typeof reservaData.activo === 'string') {
        reservaData.activo = reservaData.activo === 'true';
      } else if (typeof reservaData.activo !== 'boolean') {
        reservaData.activo = true;
      }
      await reservaService.create(reservaData);
      mostrarAlerta("¡Éxito!", "Reserva creada exitosamente");
      setMostrarModal(false);
      setNuevaReserva({ ...defaultReserva });
      obtenerReservas();
    } catch (err) {
      mostrarAlerta("Error", "Error al crear la reserva: " + err.message);
    }
  };

  const actualizarReserva = async () => {
    try {
      // Forzar activo a booleano
      const reservaData = { ...reservaSeleccionada };
      if (typeof reservaData.activo === 'string') {
        reservaData.activo = reservaData.activo === 'true';
      } else if (typeof reservaData.activo !== 'boolean') {
        reservaData.activo = true;
      }
      await reservaService.update(reservaSeleccionada._id, reservaData);
      mostrarAlerta("¡Éxito!", "Reserva actualizada exitosamente");
      setMostrarModal(false);
      setReservaSeleccionada(null);
      setModoEdicion(false);
      obtenerReservas();
    } catch (err) {
      mostrarAlerta("Error", "Error al actualizar reserva: " + err.message);
    }
  };

  const eliminarReserva = async (id) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción eliminará el usuario de forma permanente."
    );

    if (!confirmado) return;
    try {
      await reservaService.delete(id);
      mostrarAlerta("¡Éxito!", "Reserva eliminada exitosamente");
      obtenerReservas();
    } catch (err) {
      mostrarAlerta("Error", "Error al eliminar reserva: " + err.message);
    }
  };

  // Modal handlers
  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevaReserva({ ...defaultReserva });
    setMostrarModal(true);
  };

  const abrirModalEditar = (reserva) => {
    // Normalizar la reserva para que el modal reciba valores compatibles
    const normalizeId = (val) => {
      if (!val && val !== 0) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'object') return val._id || val.id || '';
      return String(val);
    };

    const formatDate = (d) => {
      if (!d) return '';
      try {
        if (typeof d === 'string') return d.substring(0, 10);
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) return '';
        return dt.toISOString().substring(0, 10);
      } catch { return ''; }
    };

    const normalized = {
      ...reserva,
      usuario: normalizeId(reserva.usuario),
      cabana: normalizeId(reserva.cabana),
      fechaInicio: formatDate(reserva.fechaInicio),
      fechaFin: formatDate(reserva.fechaFin),
      precio: reserva.precio !== undefined && reserva.precio !== null ? reserva.precio : '',
      activo: typeof reserva.activo === 'boolean' ? reserva.activo : (String(reserva.activo) === 'true')
    };

    setModoEdicion(true);
    setReservaSeleccionada(normalized);
    setMostrarModal(true);
  };

  // Search filter
  const reservasFiltradas = reservas.filter(r => {
    const q = (busqueda || '').toString().trim().toLowerCase();

    // filtro por estado (normalizamos a minúsculas)
    if (filtroEstado && filtroEstado !== 'todos') {
      if ((String(r.estado || '').toLowerCase()) !== String(filtroEstado).toLowerCase()) return false;
    }

    // filtro por cabaña (acepta objeto poblado o id)
    if (filtroCabana && filtroCabana !== 'todos') {
      const cabId = r.cabana?._id || r.cabana || '';
      if (String(cabId) !== String(filtroCabana)) return false;
    }

    // filtro por usuario (acepta objeto poblado o id)
    if (filtroUsuario && filtroUsuario !== 'todos') {
      const userId = r.usuario?._id || r.usuario || '';
      if (String(userId) !== String(filtroUsuario)) return false;
    }

    if (!q) return true;
    const partes = [
      r.usuario?.nombre || r.usuario?.nombreCompleto || r.usuario || '',
      r.usuario?.email || '',
      r.cabana?.nombre || r.cabana || '',
      r.numeroDocumento || '',
      r.nombre || '',
      r.apellido || ''
    ];
    return partes.join(' ').toLowerCase().includes(q);
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(reservasFiltradas.length / registrosPorPagina);
  const reservasPaginadas = reservasFiltradas.slice(
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
        <div className="space-y-7 fade-in-up p-9">
          <div className="page-header-Academicos">
            <div className="page-title-admin">
              <h1>Gestión de Reservas</h1>
              <p>Administra las cuentas de usuario del sistema</p>
            </div>
            {canCreate && !readOnly && (
              <button className="btn-admin btn-primary-admin" onClick={abrirModalCrear}>
                + Nueva Reserva
              </button>
            )}
          </div>
          <div className="dashboard-grid-reporte-admin grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat-card-reporte-admin flex items-center gap-4 p-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600">
                <Calendar className="w-6 h-6 text-white" aria-hidden />
              </div>
              <div className="stat-info-admin">
                <h3>{formatNumber(estadisticasReservas.totalReservas)}</h3>
                <p>Total Reservas</p>
              </div>
            </div>

            <div className="stat-card-reporte-admin flex items-center gap-4 p-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-600">
                <CheckCircle className="w-6 h-6 text-white" aria-hidden />
              </div>
              <div className="stat-info-admin">
                <h3>{formatNumber(estadisticasReservas.activas)}</h3>
                <p>Activas</p>
              </div>
            </div>

            <div className="stat-card-reporte-admin flex items-center gap-4 p-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-500">
                <Clock className="w-6 h-6 text-white" aria-hidden />
              </div>
              <div className="stat-info-admin">
                <h3>{formatNumber(estadisticasReservas.pendientes)}</h3>
                <p>Pendientes</p>
              </div>
            </div>

            <div className="stat-card-reporte-admin flex items-center gap-4 p-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-violet-600">
                <BarChart className="w-6 h-6 text-white" aria-hidden />
              </div>
              <div className="stat-info-admin">
                <h3>{formatNumber(estadisticasReservas.nuevasEsteMes)}</h3>
                <p>Nuevas este mes</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar reservas (usuario, cabaña, documento)..."
                  value={busqueda}
                  onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
                  className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                />
              </div>
              <div className="flex space-x-3">
                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroUsuario}
                  onChange={(e) => { setFiltroUsuario(e.target.value); setPaginaActual(1); }}
                >
                  <option value="todos">Todos los Usuarios</option>
                  {usuarios.map(u => (
                    <option key={u._id || u.id} value={u._id || u.id}>{u.nombre || u.email || u._id}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroCabana}
                  onChange={(e) => { setFiltroCabana(e.target.value); setPaginaActual(1); }}
                >
                  <option value="todos">Todas las Cabañas</option>
                  {cabanas.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.nombre || c._id}</option>
                  ))}
                </select>
                <select
                  className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={filtroEstado}
                  onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}

          <div className="p-6 glass-card rounded-2xl border border-white/20 shadow-lg overflow-hidden user-card">
            <TablaReservas
              reservas={reservasPaginadas}
              onEditar={canEdit && !readOnly ? abrirModalEditar : null}
              onEliminar={canDelete && !modoTesorero && !readOnly ? eliminarReserva : null}
            />
          </div>
        

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
          <ReservasModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            reservaSeleccionada={reservaSeleccionada}
            setReservaSeleccionada={setReservaSeleccionada}
            nuevaReserva={nuevaReserva}
            setNuevaReserva={setNuevaReserva}
            usuarios={usuarios}
            cabanas={cabanas}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicion ? actualizarReserva : crearReserva}
          />
      </div>
    </div>
  );
};

export default GestionReservas;

// Validación de props con PropTypes

GestionReservas.propTypes = {
  readOnly: PropTypes.bool,
  modoTesorero: PropTypes.bool,
  canCreate: PropTypes.bool,
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool
};
