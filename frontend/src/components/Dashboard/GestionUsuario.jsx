import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UsuarioModal from "./Modales/UsuarioModal";
import TablaUsuarios from "./Tablas/UserTabla";
import { userService } from "../../services/userService";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import PropTypes from 'prop-types';
import "./Dashboard.css";
import {Search,} from 'lucide-react';

const GestionUsuario = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp, modoTesorero = false, userRole, readOnly = false, canCreate = true, canEdit = true, canDelete = true }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroRole, setFiltroRole] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("dashboard");
    const [estadisticas, setEstadisticas] = useState({
        totalUsuarios: 0,
        usuariosActivos: 0,
        administradores: 0,
        nuevosHoy: 0,
    });
    const [usuarioActual, setUsuarioActual] = useState(usuarioProp);
    const navigate = useNavigate();
    // Si no se pasa usuario como prop, obtenerlo desde localStorage
    useEffect(() => {
        if (!usuarioProp) {
            const usuarioStorage = localStorage.getItem('usuario');
            if (usuarioStorage) {
                setUsuarioActual(JSON.parse(usuarioStorage));
            }
        }
    }, [usuarioProp]);

    // Redirigir si el usuario no tiene rol de admin o tesorero
    useEffect(() => {
        try {
            const rol = usuarioActual && usuarioActual.role ? String(usuarioActual.role).toLowerCase() : null;
            if (rol && rol !== 'admin' && rol !== 'tesorero') {
                if (rol === 'seminarista') navigate('/seminarista', { replace: true });
                else if (rol === 'externo') navigate('/external', { replace: true });
                else navigate('/', { replace: true });
            }
        } catch (e) {
            console.error('Error comprobando rol para redirección:', e);
        }
    }, [usuarioActual, navigate]);

    // Helper para extraer mensajes de validación desde error.details
    const extractFieldMessages = (details) => {
        const fieldMsgs = [];
        if (!details) return fieldMsgs;
        try {
            const errs = details.errors;
            if (Array.isArray(errs)) {
                for (const e of errs) {
                    fieldMsgs.push(e.msg || e.message || JSON.stringify(e));
                }
            } else if (typeof errs === 'object') {
                for (const v of Object.values(errs)) {
                    fieldMsgs.push(v);
                }
            }
        } catch (error_) {
            console.error('Error parsing validation details', error_);
        }
        return fieldMsgs;
    };

    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        tipoDocumento: "",
        numeroDocumento: "",
        fechaNacimiento: "",
        password: "",
        role: "externo",
        estado: "activo"
    });
    // Obtener usuarios
    const obtenerUsuarios = async () => {
        try {
            const data = await userService.getAllUsers();
            const usuariosData = Array.isArray(data.data) ? data.data : [];
            setUsuarios(usuariosData);
            obtenerEstadisticas();
        } catch (error) {
            console.error("Error al obtener usuarios:", error.message);
            if (error.message === "Unauthorized") {
                localStorage.removeItem("token");
            }
        }
    };

    // Calcular estadísticas

    const obtenerEstadisticas = async () => {
        try {
            const stats = await userService.getUserStats();
            setEstadisticas(stats);
        } catch (error) {
            console.error("Error al obtener estadísticas de usuarios:", error);
        }
    };

    // Crear usuario
    const crearUsuario = async (e) => {
        if (e) e.preventDefault();
        try {

            await userService.createUser(nuevoUsuario);
            mostrarAlerta("¡Éxito!", "Usuario creado exitosamente");
            setMostrarModal(false);
            setNuevoUsuario({
                nombre: "",
                apellido: "",
                correo: "",
                telefono: "",
                tipoDocumento: "",
                numeroDocumento: "",
                fechaNacimiento: "",
                password: "",
                role: "externo",
                estado: "activo"
            });
            obtenerUsuarios();
        } catch (error) {
            // Extraer mensaje útil del error del servidor si existe (userService adjunta .details)
            const serverMsg = (error && (error.details?.message || error.details?.error)) || error.message || 'Error desconocido';
            console.error('Error creando usuario:', error, error.details || null);
            // Si hay detalles de validación por campo, construir mensaje más claro
            if (error.details && error.details.errors) {
                const fieldMsgs = extractFieldMessages(error.details);
                const detailText = fieldMsgs.length ? fieldMsgs.join('; ') : serverMsg;
                mostrarAlerta("Error", `Error al crear el usuario: ${detailText}`, 'error');
            } else {
                mostrarAlerta("Error", `Error al crear el usuario: ${serverMsg}`, 'error');
            }
        }
    };

    // Actualizar usuario
    const actualizarUsuario = async (e) => {
        if (e) e.preventDefault();
        try {
            await userService.updateUser(usuarioSeleccionado._id, {
                nombre: usuarioSeleccionado.nombre,
                apellido: usuarioSeleccionado.apellido,
                correo: usuarioSeleccionado.correo,
                telefono: usuarioSeleccionado.telefono,
                tipoDocumento: usuarioSeleccionado.tipoDocumento,
                numeroDocumento: usuarioSeleccionado.numeroDocumento,
                fechaNacimiento: usuarioSeleccionado.fechaNacimiento,
                role: usuarioSeleccionado.role,
                estado: usuarioSeleccionado.estado,
            });
            mostrarAlerta("¡Éxito!", "Usuario actualizado exitosamente");
            setMostrarModal(false);
            setUsuarioSeleccionado(null);
            setModoEdicion(false);
            // Si el usuario editado es el usuario actual, actualiza el estado y el localStorage
            if (usuarioActual && usuarioSeleccionado._id === usuarioActual._id) {
                const nuevoUsuarioActual = {
                    ...usuarioActual,
                    nombre: usuarioSeleccionado.nombre,
                    apellido: usuarioSeleccionado.apellido,
                    correo: usuarioSeleccionado.correo,
                    telefono: usuarioSeleccionado.telefono,
                    tipoDocumento: usuarioSeleccionado.tipoDocumento,
                    numeroDocumento: usuarioSeleccionado.numeroDocumento,
                    role: usuarioSeleccionado.role,
                    estado: usuarioSeleccionado.estado,
                    fechaNacimiento: usuarioSeleccionado.fechaNacimiento,
                };
                setUsuarioActual(nuevoUsuarioActual);
                localStorage.setItem('usuario', JSON.stringify(nuevoUsuarioActual));
            }
            obtenerUsuarios();
        } catch (error) {
            const serverMsg = (error && (error.details?.message || error.details?.error)) || error.message || 'Error desconocido';
            console.error('Error actualizando usuario:', error, error.details || null);
            if (error.details && error.details.errors) {
                const fieldMsgs = extractFieldMessages(error.details);
                const detailText = fieldMsgs.length ? fieldMsgs.join('; ') : serverMsg;
                mostrarAlerta("Error", `Error: ${detailText}`, 'error');
            } else {
                mostrarAlerta("Error", `Error: ${serverMsg}`, 'error');
            }
        }
    };

    // Eliminar usuario
    const eliminarUsuario = async (userId) => {
        const confirmado = await mostrarConfirmacion(
            "¿Estás seguro?",
            "Esta acción eliminará el usuario de forma permanente."
        );

        if (!confirmado) return;

        try {
            await userService.deleteUser(userId);
            mostrarAlerta("¡Éxito!", "Usuario eliminado exitosamente");
            obtenerUsuarios();
        } catch (error) {
            mostrarAlerta("Error", `No se pudo eliminar el usuario: ${error.message}, 'error'`);
        }
    };

    // Abrir modal para crear usuario
    const abrirModalCrear = () => {
        setModoEdicion(false);
        setNuevoUsuario({ nombre: "", apellido: "", correo: "", telefono: "", password: "", role: "participante" });
        setMostrarModal(true);
    };

    // Abrir modal para editar usuario
    const abrirModalEditar = (usuario) => {
        setModoEdicion(true);
        setUsuarioSeleccionado({ ...usuario });
        setMostrarModal(true);
    };

    useEffect(() => {
        obtenerUsuarios();
        // eslint-disable-next-line
    }, []);

    // Filtrar usuarios
    const usuariosFiltrados = Array.isArray(usuarios)
        ? usuarios.filter((user) => {
            const texto = busqueda.toLowerCase();
            const matchBusqueda =
                user.nombre?.toLowerCase().includes(texto) ||
                user.correo?.toLowerCase().includes(texto) ||
                (user.role && String(user.role).toLowerCase().includes(texto));
            const matchRole = !filtroRole || (user.role && String(user.role) === filtroRole);
            const matchEstado = !filtroEstado || (user.estado && String(user.estado) === filtroEstado);
            return matchBusqueda && matchRole && matchEstado;
        })
        : [];

    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;
    const totalPaginas = Math.ceil(usuariosFiltrados.length / registrosPorPagina);
    const usuariosPaginados = usuariosFiltrados.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
    );

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



    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
            <Sidebar
                sidebarAbierto={sidebarAbierto}
                setSidebarAbierto={setSidebarAbierto}
                seccionActiva={seccionActiva}
                setSeccionActiva={setSeccionActiva}
            />
            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarAbierto ? 'ml-72' : 'ml-20'}`}>
                <Header
                    sidebarAbierto={sidebarAbierto}
                    setSidebarAbierto={setSidebarAbierto}
                    seccionActiva={seccionActiva}
                />
                <div className="space-y-7 fade-in-up  p-9 ">
                    <div className="page-header-Academicos">
                        <div className="page-title-admin">
                            <h1>Gestión de Usuarios</h1>
                            <p>Administra las cuentas de usuario del sistema</p>
                        </div>
                        <button className="btn-admin btn-primary-admin" onClick={abrirModalCrear}>
                            + Nueva Usuario
                        </button>
                    </div>
                    <div className="dashboard-grid-reporte-admin">
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin users">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.totalUsuarios}</h3>
                                <p>Total Usuarios</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin active">
                                <i className="fas fa-user-check"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.usuariosActivos}</h3>
                                <p>Usuarios Activos</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin admins">
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.administradores}</h3>
                                <p>Administradores</p>
                            </div>
                        </div>
                        <div className="stat-card-reporte-admin">
                            <div className="stat-icon-reporte-admin-admin new">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <div className="stat-info-admin">
                                <h3>{estadisticas.nuevosEsteMes}</h3>
                                <p>Nuevos Este Mes</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar usuarios..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 glass-card border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <select
                                    className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={filtroRole}
                                    onChange={(e) => { setFiltroRole(e.target.value); setPaginaActual(1); }}
                                >
                                    <option value="">Todos los Roles</option>
                                    <option value="admin">Administrador</option>
                                    <option value="seminarista">Seminarista</option>
                                    <option value="tesorero">Tesorero</option>
                                    <option value="externo">Usuario Externo</option>
                                </select>
                                <select
                                    className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={filtroEstado}
                                    onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
                                >
                                    <option value="">Todos los Estados</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="p-6 glass-card rounded-2xl border border-white/20 shadow-lg overflow-hidden user-card">
                        <TablaUsuarios
                            usuarios={usuariosPaginados}
                            onEditar={abrirModalEditar}
                            onEliminar={eliminarUsuario}
                            onToggleEstado={onToggleEstado}
                        />
                    </div>


                    {/* Paginación funcional */}
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
                </div>
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
            </div>
        </div >
    )
}

export default GestionUsuario;

// Validación de props con PropTypes

GestionUsuario.propTypes = {
    usuario: PropTypes.object,
    onCerrarSesion: PropTypes.func,
    modoTesorero: PropTypes.bool,
    userRole: PropTypes.string,
    readOnly: PropTypes.bool,
    canCreate: PropTypes.bool,
    canEdit: PropTypes.bool,
    canDelete: PropTypes.bool
};