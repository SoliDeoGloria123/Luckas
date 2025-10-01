import React, { useState, useRef, useEffect } from 'react';
import UsuarioModal from "./Modales/UsuarioModal";
import TablaUsuarios from "./Tablas/UserTabla";
import { userService } from "../../services/userService";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';

import "./Dashboard.css";

import {

    Search,

    Plus,

    Calendar as CalendarIcon,

} from 'lucide-react';

const GestionUsuario = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp, modoTesorero = false, userRole, readOnly = false, canCreate = true, canEdit = true, canDelete = true }) => {
    const [submenuAcademicoAbierto, setSubmenuAcademicoAbierto] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [busqueda, setBusqueda] = useState("");
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

    // Si no se pasa usuario como prop, obtenerlo desde localStorage
    useEffect(() => {
        if (!usuarioProp) {
            const usuarioStorage = localStorage.getItem('usuario');
            if (usuarioStorage) {
                setUsuarioActual(JSON.parse(usuarioStorage));
            }
        }
    }, [usuarioProp]);

    /*const handleCerrarSesion = () => {
        if (onCerrarSesionProp) {
            onCerrarSesionProp();
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
    };*/


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

    //----------------------------------------------------------------------------------------------------------
    // Obtener usuarios
    const obtenerUsuarios = async () => {
        try {
            const data = await userService.getAllUsers();
            const usuariosData = Array.isArray(data.data) ? data.data : [];
            setUsuarios(usuariosData);
            calcularEstadisticas(usuariosData);
        } catch (error) {
            console.error("Error al obtener usuarios:", error.message);
            if (error.message === "Unauthorized") {
                localStorage.removeItem("token");
                //handleCerrarSesion();
            }
        } finally {
            setCargando(false);
        }
    };

    // Calcular estadísticas
    const calcularEstadisticas = (usuariosData) => {
        const hoy = new Date().toDateString();
        setEstadisticas({
            totalUsuarios: usuariosData.length,
            usuariosActivos: usuariosData.filter((user) => user.status === "active").length,
            administradores: usuariosData.filter((user) => user.role === "admin").length,
            nuevosHoy: usuariosData.filter((user) => new Date(user.createdAt).toDateString() === hoy).length,
        });
    };

    // Crear usuario
    const crearUsuario = async (e) => {
        if (e) e.preventDefault();
        try {
            console.log("Datos enviados al backend:", nuevoUsuario); // <-- Agrega esto
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
            mostrarAlerta("Error", `Error al crear el usuario: ${error.message}`);
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
            mostrarAlerta("Error", `Error: ${error.message}`);
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
            mostrarAlerta("Error", `No se pudo eliminar el usuario: ${error.message}`);
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
        ? usuarios.filter(
            (user) =>
                user.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                user.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
                user.role?.toLowerCase().includes(busqueda.toLowerCase())
        )
        : [];

    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;
    const totalPaginas = Math.ceil(usuariosFiltrados.length / registrosPorPagina);
    const usuariosPaginados = usuariosFiltrados.slice(
        (paginaActual - 1) * registrosPorPagina,
        paginaActual * registrosPorPagina
    );
    /*-----------------------------------------------------------------------------------------------------------*/
    const [datosUnificados, setDatosUnificados] = useState({
        solicitudes: [],
        inscripciones: [],
        reservas: []
    });

    useEffect(() => {
        if (seccionActiva === "solicitudes") {
            obtenerDatosUnificados();
        }
        // eslint-disable-next-line
    }, [seccionActiva]);

    const obtenerDatosUnificados = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/solicitudes/unificado", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!res.ok) throw new Error("Error al obtener datos unificados");
            const data = await res.json();
            setDatosUnificados({
                solicitudes: data.data.solicitudes || [],
                inscripciones: data.data.inscripciones || [],
                reservas: data.data.reservas || [],
            });
        } catch (error) {
            alert("Error al obtener datos unificados: " + error.message);
        }
    };

    const [mostrarMenu, setMostrarMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMostrarMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (cargando) {
        return (
            <div className="cargando-contenedor">
                <div className="spinner"></div>
                <p>Cargando dashboard...</p>
            </div>
        );
    }

    // Si no hay usuario y no se está pasando como prop, mostrar loading
    if (!usuarioActual && !usuarioProp) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>Cargando...</div>
            </div>
        );
    }


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
                                <select className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                                    <option>Todos los Roles</option>
                                    <option>Administrador</option>
                                    <option>Seminarista</option>
                                    <option>Tesorero</option>
                                    <option>Usuario Externo</option>
                                </select>
                                <select className="px-4 py-3 glass-card border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                                    <option>Todos los Estados</option>
                                    <option>Activo</option>
                                    <option>Inactivo</option>
                                    <option>Pendiente</option>
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
                        />
                    </div>

                    {/* Modal */}
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
            </div>
        </div >
    )
}

export default GestionUsuario;