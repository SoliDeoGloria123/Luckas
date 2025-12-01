import React, { useState, useEffect } from 'react';
import UsuarioModal from '../../Dashboard/Modales/UsuarioModal';
import { userService } from '../../../services/userService'
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import { Edit } from "lucide-react"

const Gestionusuarios = () => {
  // Datos de ejemplo
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Variables para el modal del Dashboard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    role: 'externo',
    fechaNacimiento: '',
    tipoDocumento: '',
    numeroDocumento: '',
    password: '',
    estado: 'activo'
  });
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    administradores: 0,
    nuevosHoy: 0,
  });

  const handleCreate = () => {
    setModoEdicion(false);
    setUsuarioSeleccionado(null);
    setNuevoUsuario({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      role: 'externo',
      fechaNacimiento: '',
      tipoDocumento: '',
      numeroDocumento: '',
      password: '',
      estado: 'activo'
    });
    setMostrarModal(true);
  };

  const handleEdit = (usuario) => {
    setModoEdicion(true);
    setUsuarioSeleccionado(usuario);
    setMostrarModal(true);
  };

  // Funciones para el modal del Dashboard
  const crearUsuario = async (e) => {
    e.preventDefault();
    // Validación extra para tipoDocumento
    if (!nuevoUsuario.tipoDocumento || nuevoUsuario.tipoDocumento === "") {
      mostrarAlerta("Error", "Debes seleccionar un tipo de documento antes de crear el usuario.", "error");
      return;
    }
    // Forzar el valor de tipoDocumento antes de enviar
    const usuarioAEnviar = {
      ...nuevoUsuario,
      tipoDocumento: nuevoUsuario.tipoDocumento
    };
    try {
      await userService.createUser(usuarioAEnviar);
      mostrarAlerta("¡Éxito!", "Usuario creado exitosamente", "success");
      setMostrarModal(false);
      obtenerUsuarios();
    } catch (error) {
      // Mostrar el mensaje real del backend si existe
      let mensaje = error.message || "Error al crear usuario";
      mostrarAlerta("Error", mensaje, "error");
    }
  };

  const actualizarUsuario = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(usuarioSeleccionado._id, usuarioSeleccionado);
      mostrarAlerta("¡Éxito!", "Usuario actualizado exitosamente");
      setMostrarModal(false);
      obtenerUsuarios();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`, 'error');
    }
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //obtener usuarios
  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      const usuariosData = Array.isArray(data.data) ? data.data : [];
      setUsuarios(usuariosData);
      setUsuariosFiltrados(usuariosData);
      obtenerEstadisticas();
    } catch (error) {
      console.error("Error al obtener los usuarios de la base de datos", error.mensage);
    }
  };

  // Función de búsqueda por número de cédula, nombre, apellido y correo
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setPaginaActual(1);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Efecto para actualizar usuarios filtrados cuando cambia la lista de usuarios
  // Aplicar filtros combinados (búsqueda + role + estado)
  const applyFilters = () => {
    const term = String(searchTerm || '').trim().toLowerCase();
    const filtered = usuarios.filter(user => {
      // Role filter
      if (filterRole && String(user.role || '').toLowerCase() !== String(filterRole).toLowerCase()) return false;
      // Status filter
      if (filterStatus && String(user.estado || '').toLowerCase() !== String(filterStatus).toLowerCase()) return false;

      if (!term) return true;

      const numeroDocumento = String(user.numeroDocumento || '').toLowerCase();
      const nombre = String(user.nombre || '').toLowerCase();
      const apellido = String(user.apellido || '').toLowerCase();
      const correo = String(user.correo || '').toLowerCase();

      return (
        numeroDocumento.includes(term) ||
        nombre.includes(term) ||
        apellido.includes(term) ||
        correo.includes(term)
      );
    });
    setUsuariosFiltrados(filtered);
    setPaginaActual(1);
  };

  useEffect(() => {
    applyFilters();
  }, [usuarios, searchTerm, filterRole, filterStatus]);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(usuariosFiltrados.length / registrosPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambia el filtro de usuarios
  useEffect(() => {
    setPaginaActual(1);
  }, [usuariosFiltrados]);

  //desactivar usuario o activarlo
  const onToggleEstado = async (usuario) => {
    const nuevoEstado = usuario.estado === "activo" ? "inactivo" : "activo";
    try {
      await userService.toggleUserEstado(usuario._id, nuevoEstado);
      mostrarAlerta("¡Éxito!", `Usuario ${nuevoEstado === "activo" ? "activado" : "desactivado"} exitosamente`);
      obtenerUsuarios(); // <-- Esto refresca la lista
    } catch (error) {
      mostrarAlerta("Error", `Error al actualizar el estado del usuario: ${error.message}`, 'error');
    }
  };

  //estadiscas usuarios 
  const obtenerEstadisticas = async () => {
    try {
      const stats = await userService.getUserStats();
      setEstadisticas(stats);
    } catch (error) {
      console.error("Error al obtener estadísticas de usuarios:", error);
    }
  };


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
              <h1>Gestión de Usuarios</h1>
              <p>Administr a las cuentas de usuario del sistema</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i> {' '}
            Nuevo Usuario
          </button>
        </div>
        <div className="stats-grid-usuarios">
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios blue">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="totalUsers">{estadisticas.totalUsuarios}</div>
              <div className="stat-label-usuarios">Total Usuarios</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="activeUsers">{estadisticas.usuariosActivos}</div>
              <div className="stat-label-usuarios">Usuarios Activos</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios purple">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="adminUsers">{estadisticas.administradores}</div>
              <div className="stat-label-usuarios">Administradores</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios orange">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="newUsers">{estadisticas.nuevosHoy || 0}</div>
              <div className="stat-label-usuarios">Nuevos Este Mes</div>
            </div>
          </div>
        </div>

        <div className="filters-section-tesorero">
          <div className="search-filters-tesorero">
            <div className="search-input-container-tesorero">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar usuarios..."
                id="userSearch"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <select className="filter-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="">Todos los Roles</option>
              <option value="admin">Administrador</option>
              <option value="seminarista">Seminarista</option>
              <option value="tesorero">Tesorero</option>
              <option value="externo">Usuario Externo</option>
            </select>
            <select id="statusFilter" className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Todos los Estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
         
        </div>
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="overflow-hidden rounded-xl border border-[#334155]/10 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#334155]/10 bg-[#f1f5f9]">

                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                        Nombre
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                        Apellido
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                        Tipo de Documento
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                        Número de Documento
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                        Fecha de Nacimiento
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                        Correo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                        Teléfono
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                        Rol
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/10">

                    {usuariosPaginados.map((user) => (
                      <tr key={user._id || user.id} className={`transition-colors hover:bg-[#f1f5f9]/50 ${user.estado === 'inactivo' ? 'usuario-inactivo-blur' : ''}`}>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-[#334155]">{user.nombre}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-[#334155]">{user.apellido}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base font-semibold text-[#334155]">{user.tipoDocumento}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base font-semibold text-[#334155]">{user.numeroDocumento}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-[#334155]/60">{user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString() : "N/A"}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-[#2563eb]">{user.correo}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base font-semibold text-[#334155]">{user.telefono}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-[#334155]">{user.role}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`badge-tesorero badge-tesorero-${user.estado}`}
                          >
                            {user.estado}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleEdit(user)}
                              size="icon"
                              className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              className={`btn-action ${user.estado === "activo" ? "desactivar" : "activar"}  text-red-600 hover:bg-red-50 rounded transition-colors`}
                              onClick={() => onToggleEstado(user)}
                            >
                              {user.estado === "activo" ? (
                                <i className="fas fa-ban"></i>
                              ) : (
                                <i className="fas fa-check"></i>
                              )}
                            </button>
                          </div>
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
            <span className="pagination-info-admin text-base text-[#334155]">
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

        {mostrarModal && (
          <UsuarioModal
            mostrar={mostrarModal}
            modoEdicion={modoEdicion}
            usuarioSeleccionado={usuarioSeleccionado}
            setUsuarioSeleccionado={setUsuarioSeleccionado}
            nuevoUsuario={nuevoUsuario}
            setNuevoUsuario={setNuevoUsuario}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicion ? actualizarUsuario : crearUsuario}
          />
        )}
      </main >
      <Footer />
    </>

  );
};

export default Gestionusuarios;