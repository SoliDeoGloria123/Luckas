import React, { useState, useEffect } from 'react';
import { reservaService } from '../../../services/reservaService';
import { userService } from '../../../services/userService';
import { cabanaService } from '../../../services/cabanaService';
import { mostrarAlerta } from '../../utils/alertas';
import ReservaModal from '../../Dashboard/Modales/ReservaModal';
import Header from '../Header/Header-tesorero';
import Footer from '../../footer/Footer';
import { Edit } from 'lucide-react';


const Gestionreserva = () => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  // Filtros y buscador
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCabana, setFilterCabana] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');

  // Variables para el modal del Dashboard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [nuevaReserva, setNuevaReserva] = useState({
    usuario: '',
    cabana: '',
    fechaInicio: '',
    fechaFin: '',
    numeroPersonas: 1,
    tipoDocumento: '',
    numeroDocumento: '',
    correoElectronico: '',
    telefono: '',
    propositoEstadia: '',
    estado: 'Pendiente'
  });
  const [estadisticas, setEstadisticas] = useState({totalReservas:0, pendientes:0, confirmadas:0, ingresosMes:0});

  //obtener reservas 
  const obtenerReservas = async () => {
    try {
      const data = await reservaService.getAll();
      let resvs = [];
      if (Array.isArray(data)) resvs = data;
      else if (Array.isArray(data.data)) resvs = data.data;
      else if (Array.isArray(data.reservas)) resvs = data.reservas;
      else resvs = [];
      setReservas(resvs);
      estadisticasIniciales();
    } catch (err) {
      console.log("Error al obtener reservas: " + err.message);
    }
  };
  //obetner estadisticas
  const estadisticasIniciales = async () => {
    try {
      const stats = await reservaService.getEstadisticasGenerales();
      setEstadisticas(stats);
      console.log("Estadísticas de reservas:", stats);
    } catch (err) {
      console.log("Error al obtener estadísticas: " + err.message);
    }
  };
  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      let users = [];
      if (Array.isArray(data)) users = data;
      else if (Array.isArray(data.data)) users = data.data;
      else if (Array.isArray(data.users)) users = data.users;
      else users = [];
      setUsuarios(users);
      console.debug('[Gestionreserva] usuarios cargados:', users.length, users[0] || null);
    } catch (err) {
      console.log("Error al obtener usuarios: " + err.message);
    }
  };

  const obtenerCabanas = async () => {
    try {
      const data = await cabanaService.getAll();
      let cabs = [];
      if (Array.isArray(data)) cabs = data;
      else if (Array.isArray(data.data)) cabs = data.data;
      else if (Array.isArray(data.cabanas)) cabs = data.cabanas;
      else cabs = [];
      setCabanas(cabs);
      console.debug('[Gestionreserva] cabañas cargadas:', cabs.length, cabs[0] || null);
    } catch (err) {
      console.log("Error al obtener cabañas: " + err.message);
    }
  };

  useEffect(() => {
    obtenerReservas();
    obtenerUsuarios();
    obtenerCabanas();
  }, []);

  const handleCreate = () => {
    setModoEdicion(false);
    setReservaSeleccionada(null);
    setNuevaReserva({
      usuario: '',
      cabana: '',
      fechaInicio: '',
      fechaFin: '',
      numeroPersonas: 1,
      tipoDocumento: '',
      numeroDocumento: '',
      correoElectronico: '',
      telefono: '',
      propositoEstadia: '',
      estado: 'Pendiente'
    });
    setMostrarModal(true);
  };

  const handleEdit = (reserva) => {
    setModoEdicion(true);
    setReservaSeleccionada(reserva);
    setMostrarModal(true);
  };

  // Funciones para el modal del Dashboard
  const crearReserva = async (payload) => {
    // Soporta recibir event (desde un submit directo) o un payload (objeto)
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevaReserva;
      await reservaService.create(body);
      mostrarAlerta("¡Éxito!", "Reserva creada exitosamente", 'success');
      setMostrarModal(false);
      obtenerReservas();
    } catch (error) {
      mostrarAlerta("Error", `Error al crear reserva: ${error.message}`, 'error');
    }
  };

  const actualizarReserva = async (payload) => {
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevaReserva;
      const id = (body && body._id) ? body._id : (reservaSeleccionada && reservaSeleccionada._id);
      if (!id) {
        mostrarAlerta('Error', 'No se encontró el ID de la reserva a actualizar', 'error');
        return;
      }
      await reservaService.update(id, body);
      mostrarAlerta("¡Éxito!", "Reserva actualizada exitosamente", 'success');
      setMostrarModal(false);
      obtenerReservas();
    } catch (error) {
      mostrarAlerta("Error", `Error al actualizar reserva: ${error.message}`, 'error');
    }
  };

  // Mostrar solicitud sin exponer la ID
  const handleMostrarSolicitud = async (solicitud) => {
    if (!solicitud) {
      mostrarAlerta('INFO', 'No hay solicitud asociada a esta reserva', 'info');
      return;
    }

    try {
      if (typeof solicitud === 'string') {
        // Mostrar la ID completa a petición del usuario, y copiarla al portapapeles si es posible.
        const fullId = String(solicitud);
        try {
          if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(fullId);
            mostrarAlerta('Solicitud', `ID: ${fullId} (ID copiada al portapapeles)`, 'info');
          } else {
            mostrarAlerta('Solicitud', `ID: ${fullId}`, 'info');
          }
        } catch (err) {
          // Si la copia falla por permisos, igualmente mostramos la ID completa
          console.warn('No se pudo copiar ID al portapapeles', err);
          mostrarAlerta('Solicitud', `ID: ${fullId}`, 'info');
        }
        return;
      }

      // solicitud es objeto: mostrar campos amigables si existen
      const candidatoTitulo = solicitud.titulo || solicitud.nombre || solicitud.tipo || '';
      const usuario = solicitud.usuario?.nombre || solicitud.usuario || '';
      const estado = solicitud.estado ? `Estado: ${solicitud.estado}` : '';
      const fecha = solicitud.fecha ? `Fecha: ${new Date(solicitud.fecha).toLocaleDateString()}` : '';
      const id = solicitud._id ? `ID: ${solicitud._id}` : '';
      const partes = [candidatoTitulo, usuario, estado, fecha].filter(Boolean);
      const mensajeResumen = partes.join(' • ') || 'Solicitud registrada';
      const mensaje = id ? `${mensajeResumen} • ${id}` : mensajeResumen;
      mostrarAlerta('Solicitud', mensaje, 'info');
    } catch (err) {
      console.error('Error mostrando solicitud', err);
      mostrarAlerta('ERROR', 'No se pudo mostrar la solicitud', 'error');
    }
  };

  // Helpers de filtrado para reducir complejidad
  const pasaFiltroCabana = (r, filterCabana) => {
    if (!filterCabana || filterCabana === 'todos') return true;
    const cabObj = r && r.cabana ? r.cabana : null;
    const cab = (cabObj && typeof cabObj === 'object') ? (cabObj._id || cabObj.nombre || cabObj) : cabObj;
    if (!cab) return false;
    return String(cab) === String(filterCabana) || String((cabObj?.nombre || '')).toLowerCase() === String(filterCabana).toLowerCase();
  };

  const pasaFiltroEstado = (r, filterEstado) => {
    if (!filterEstado || filterEstado === 'todos') return true;
    return (r.estado || '').toLowerCase() === String(filterEstado).toLowerCase();
  };

  const pasaBusqueda = (r, searchTerm) => {
    if (!searchTerm) return true;
    const s = searchTerm.trim().toLowerCase();
    if (!s) return true;
    const usuarioObj = r && r.usuario ? r.usuario : null;
    const nombreUsuario = ((usuarioObj && typeof usuarioObj === 'object')
      ? (usuarioObj.username || usuarioObj.nombre || usuarioObj.correo || '')
      : (usuarioObj || '')
    ).toString().toLowerCase();
    const cabanaObj = r && r.cabana ? r.cabana : null;
    const cabanaNombre = ((cabanaObj && typeof cabanaObj === 'object') ? (cabanaObj.nombre || '') : (cabanaObj || '')).toString().toLowerCase();
    const campos = [
      nombreUsuario,
      cabanaNombre,
      (r.tipoDocumento || '').toLowerCase(),
      (r.numeroDocumento || '').toLowerCase(),
      (r.correoElectronico || '').toLowerCase(),
      (r.telefono || '').toLowerCase(),
      (r.propositoEstadia || '').toLowerCase()
    ];
    return campos.some(c => c.includes(s));
  };

  const reservasFiltradas = (reservas || []).filter((r) => (
    pasaFiltroCabana(r, filterCabana) && pasaFiltroEstado(r, filterEstado) && pasaBusqueda(r, searchTerm)
  ));

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(reservasFiltradas.length / registrosPorPagina) || 1;
  const reservasPaginadas = reservasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambian filtros o la lista de reservas
  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm, filterCabana, filterEstado, reservas.length]);

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
              <h1>Gestión de Reservas</h1>
              <p>Administra reservas de cabañas y servicios</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i> {' '}
            Nueva Reserva
          </button>
        </div>
        <div className="stats-grid-usuarios">
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios blue">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="totalUsers">{estadisticas.totalReservas}</div>
              <div className="stat-label-usuarios">Total Reservas</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios orange">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="activeUsers">{estadisticas.pendientes}</div>
              <div className="stat-label-usuarios">Pendientes</div>
            </div>
          </div>
           <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="newUsers">{estadisticas.confirmadas}</div>
              <div className="stat-label-usuarios">Confirmadas</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios purple">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="adminUsers">{estadisticas.nuevasEsteMes}</div>
              <div className="stat-label-usuarios">Ingresos Mes</div>
            </div>
          </div>
         
        </div>

        <div className="filters-section-tesorero">
          <div className="search-filters-tesorero">
              <div className="search-input-container-tesorero">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Buscar reservas..."
                  id="userSearch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="filter-select"
                value={filterCabana}
                onChange={(e) => setFilterCabana(e.target.value)}
              >
                <option value="todos">Todas las Cabañas</option>
                {(cabanas || []).map((c) => (
                  <option key={c._id || c.nombre} value={c._id || c.nombre}>{c.nombre || c._id}</option>
                ))}
              </select>
              <select
                id="statusFilter"
                className="filter-select"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
               <option value="todos">Todos los Estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Cancelada">Cancelada</option>
                    <option value="finalizada">Finalizada</option>
              </select>
            </div>
          
        </div>


        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-[#334155]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="users-table-tesorero">
                <thead>
                  <tr className="border-b border-[#334155]/10 bg-[#f1f5f9]">

                   
                    <th>Usuario</th>
                    <th>Cabaña</th>
                    <th>Fecha Inicio</th>
                    <th>Fecha Fin</th>
                    <th>Número de Personas</th>
                    <th>Tipo de Documento</th>
                    <th>Número de Documento</th>
                    <th>Correo Electrónico</th>
                    <th>Teléfono</th>
                    <th>Propósito de Estadía</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                    <th>Solicitud</th>
                    <th>Activo</th>
                    <th>Fecha de creación</th>
                    <th>Fecha de actualización</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody id="usersTableBody">
                    {reservasPaginadas.map((reser) => (
                      <tr key={reser._id}>
                    
                        <td>
                          {typeof reser.usuario === "object"
                            ? reser.usuario?.username || reser.usuario?.nombre || reser.usuario?.correo || reser.usuario?._id || "N/A"
                            : reser.usuario || "N/A"}
                        </td>

                        <td>
                          {typeof reser.cabana === "object"
                            ? reser.cabana?.nombre || reser.cabana?._id || "N/A"
                            : reser.cabana || "N/A"}
                        </td>
                        <td>{reser.fechaInicio ? new Date(reser.fechaInicio).toLocaleDateString() : ""}</td>
                        <td>{reser.fechaFin ? new Date(reser.fechaFin).toLocaleDateString() : ""}</td>
                        <td>{reser.numeroPersonas || "N/A"}</td>
                        <td>{reser.tipoDocumento || "N/A"}</td>
                        <td>{reser.numeroDocumento || "N/A"}</td>
                        <td>{reser.correoElectronico || "N/A"}</td>
                        <td>{reser.telefono || "N/A"}</td>
                        <td>{reser.propositoEstadia || "N/A"}</td>

                        <td>
                          <span className={`badge-tesorero badge-tesorero-${reser.estado} `}>
                            {reser.estado}
                          </span>

                        </td>
                        <td>{reser.observaciones || "N/A"}</td>
                        <td>
                          {reser.solicitud ? (
                            <button
                              className="text-blue-600 hover:underline"
                              onClick={() => handleMostrarSolicitud(reser.solicitud)}
                              title="Ver solicitud"
                            >
                              Ver solicitud
                            </button>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>
                          <span className={`status-badge status-${reser.activo ? 'Activo' : 'Desactivado'}`}>
                            {reser.activo ? 'Activo' : 'Desactivado'}
                          </span>
                        </td>
                        <td>{reser.createdAt ? new Date(reser.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td>{reser.updatedAt ? new Date(reser.updatedAt).toLocaleDateString() : "N/A"}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <button className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]" onClick={() => handleEdit(reser)}>
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                 
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

        {mostrarModal && (
          <ReservaModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            reservaSeleccionada={reservaSeleccionada}
            setReservaSeleccionada={setReservaSeleccionada}
            nuevaReserva={nuevaReserva}
            setNuevaReserva={setNuevaReserva}
            usuarios={usuarios}
            cabanas={cabanas}
            onClose={() => setMostrarModal(false)}
            onSubmit={(e) => modoEdicion ? actualizarReserva(e) : crearReserva(e)}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gestionreserva;