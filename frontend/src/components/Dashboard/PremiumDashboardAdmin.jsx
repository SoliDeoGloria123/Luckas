import React, { useState, useEffect, useRef, Suspense } from 'react';
import { userService } from '../../services/userService';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Calendar,
  Home,
  GraduationCap,
  FileText,
  UserPlus,
  Mail,
  CheckSquare,
  Bell,
  Search,
  Menu,
  Plus,
  Activity,
  TrendingUp,
  TrendingDown,
  Shield,
  BookOpen,
  Layers,
  Calendar as CalendarIcon
} from 'lucide-react';

// Componentes críticos (no lazy)
import UsuarioModal from "./Modales/UsuarioModal";
import PerfilModal from "./Modales/PerfilModal";
import TablaUsuarios from "./Tablas/UserTabla";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';

// Lazy imports para mejor rendimiento
import {
  GestionSolicitudLazy,
  ReportesLazy,
  ProgramasAcademicosLazy,
  CursosLazy,
  ProgramasTecnicosLazy,
  GestionCategorizacionLazy,
  GestionIscripcionLazy,
  GestionEventosLazy,
  GestionTareaLazy,
  GestioCabañasLazy,
  GestionReservasLazy,
  PremiumLoader
} from './LazyComponents';

const PremiumDashboardAdmin = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp }) => {
  React.useEffect(() => {
    console.log('mostrarPerfilModal:', mostrarPerfilModal);
  }, [mostrarPerfilModal]);
  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    administradores: 0,
    nuevosHoy: 0,
  });
  const [usuarioActual, setUsuarioActual] = useState(usuarioProp);
  const [mostrarPerfilModal, setMostrarPerfilModal] = useState(false);
  
  const menuRef = useRef(null);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    tipoDocumento: "",
    numeroDocumento: "",
    password: "",
    role: "externo",
    estado: "activo"
  });

  // Acciones de perfil
  const handleActualizarPerfil = async (form, file) => {
    try {
      const res = await userService.updateProfile(form, file);
      mostrarAlerta("¡Éxito!", "Perfil actualizado correctamente");
      setUsuarioActual(res.data || usuarioActual);
      localStorage.setItem('usuario', JSON.stringify(res.data || usuarioActual));
      setMostrarPerfilModal(false);
    } catch (error) {
      mostrarAlerta("Error", error.message, "error");
    }
  };

  const handleCambiarPassword = async (actual, nueva) => {
    try {
      await userService.changePassword(actual, nueva);
      mostrarAlerta("¡Éxito!", "Contraseña actualizada correctamente");
      setMostrarPerfilModal(false);
    } catch (error) {
      mostrarAlerta("Error", error.message, "error");
    }
  };

  // Menú de navegación
  const menuItems = [
    {
      section: "PRINCIPAL",
      items: [
        { id: "dashboard", icon: Activity, label: "Dashboard", color: "text-blue-500" },
        { id: "usuarios", icon: Users, label: "Usuarios", color: "text-purple-500" },
        { id: "configuracion", icon: Settings, label: "Configuración", color: "text-gray-500" },
      ]
    },
    {
      section: "GESTIÓN ACADÉMICA",
      items: [
        { id: "categorizacion", icon: Layers, label: "Categorización", color: "text-emerald-500" },
        { id: "programas-academicos", icon: GraduationCap, label: "Programas Académicos", color: "text-blue-600" },
        { id: "cursos", icon: BookOpen, label: "Cursos", color: "text-indigo-500" },
        { id: "programas-tecnicos", icon: FileText, label: "Prog. Técnicos", color: "text-violet-500" },
        { id: "eventos", icon: CalendarIcon, label: "Eventos", color: "text-amber-500" },
      ]
    },
    {
      section: "ADMINISTRACIÓN",
      items: [
        { id: "solicitudes", icon: Mail, label: "Solicitudes", color: "text-rose-500" },
        { id: "inscripciones", icon: UserPlus, label: "Inscripciones", color: "text-cyan-500" },
        { id: "tareas", icon: CheckSquare, label: "Tareas", color: "text-green-500" },
      ]
    },
    {
      section: "SERVICIOS",
      items: [
        { id: "cabanas", icon: Home, label: "Cabañas", color: "text-orange-500" },
        { id: "reservas", icon: Calendar, label: "Reservas", color: "text-teal-500" },
        { id: "reportes", icon: BarChart3, label: "Reportes", color: "text-pink-500" },
      ]
    }
  ];

  // Efectos
  useEffect(() => {
    if (!usuarioProp) {
      const usuarioStorage = localStorage.getItem('usuario');
      if (usuarioStorage) {
        setUsuarioActual(JSON.parse(usuarioStorage));
      }
    }
  }, [usuarioProp]);

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

  // Funciones de gestión de usuarios
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
        handleCerrarSesion();
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const handleCerrarSesion = () => {
    if (onCerrarSesionProp) {
      onCerrarSesionProp();
    } else {
      localStorage.removeItem('token'); 
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
  };

  const calcularEstadisticas = (usuariosData) => {
    const hoy = new Date().toDateString();
    setEstadisticas({
      totalUsuarios: usuariosData.length,
      usuariosActivos: usuariosData.filter((user) => user.status === "active").length,
      administradores: usuariosData.filter((user) => user.role === "admin").length,
      nuevosHoy: usuariosData.filter((user) => new Date(user.createdAt).toDateString() === hoy).length,
    });
  };

  const crearUsuario = async () => {
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
        password: "",
        role: "externo",
        estado: "activo"
      });
      obtenerUsuarios();
    } catch (error) {
      mostrarAlerta("Error", `Error al crear el usuario: ${error.message}`, "error");
    }
  };

  const actualizarUsuario = async () => {
    try {
      await userService.updateUser(usuarioSeleccionado._id, {
        nombre: usuarioSeleccionado.nombre,
        apellido: usuarioSeleccionado.apellido,
        correo: usuarioSeleccionado.correo,
        telefono: usuarioSeleccionado.telefono,
        tipoDocumento: usuarioSeleccionado.tipoDocumento,
        numeroDocumento: usuarioSeleccionado.numeroDocumento,
        role: usuarioSeleccionado.role,
        estado: usuarioSeleccionado.estado,
      });
      mostrarAlerta("¡Éxito!", "Usuario actualizado exitosamente");
      setMostrarModal(false);
      setUsuarioSeleccionado(null);
      setModoEdicion(false);
      
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
        };
        setUsuarioActual(nuevoUsuarioActual);
        localStorage.setItem('usuario', JSON.stringify(nuevoUsuarioActual));
      }
      obtenerUsuarios();
    } catch (error) {
      mostrarAlerta("Error", `Error: ${error.message}`, "error");
    }
  };

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
      mostrarAlerta("Error", `No se pudo eliminar el usuario: ${error.message}`, "error");
    }
  };

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setNuevoUsuario({ nombre: "", apellido: "", correo: "", telefono: "", password: "", role: "participante" });
    setMostrarModal(true);
  };

  const abrirModalEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioSeleccionado({ ...usuario });
    setMostrarModal(true);
  };

  // Filtros
  const usuariosFiltrados = Array.isArray(usuarios)
    ? usuarios.filter(
        (user) =>
          user.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
          user.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
          user.role?.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];

  // Loading state
  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-lg font-semibold text-slate-700">Cargando dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!usuarioActual && !usuarioProp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-lg font-semibold text-slate-700">Cargando usuario...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Sidebar Premium */}
      <div className={`fixed left-0 top-0 h-full bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl transition-all duration-300 z-30 ${
        sidebarAbierto ? 'w-72' : 'w-20'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            {sidebarAbierto && (
              <div>
                <h1 className="text-xl font-bold text-slate-800">Luckas</h1>
                <p className="text-sm text-slate-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {sidebarAbierto && (
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {section.section}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = seccionActiva === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setSeccionActiva(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color}`} />
                        {sidebarAbierto && (
                          <span className="font-medium">{item.label}</span>
                        )}
                        {isActive && sidebarAbierto && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarAbierto ? 'ml-72' : 'ml-20'}`}>
        {/* Header Premium */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarAbierto(!sidebarAbierto)}
                className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="text-sm text-slate-500">
                Dashboard / {seccionActiva.charAt(0).toUpperCase() + seccionActiva.slice(1)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 bg-slate-100/80 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>

              {/* User Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMostrarMenu(!mostrarMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {usuarioActual?.nombre?.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-800">{usuarioActual?.nombre}</p>
                    <p className="text-xs text-slate-500">Administrador</p>
                  </div>
                </button>

                {mostrarMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-100/80 transition-colors">
                      Configuración
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-100/80 transition-colors" onClick={() => { setMostrarMenu(false); setMostrarPerfilModal(true); }}>
                      Perfil
                    </button>
                    <div className="border-t border-slate-200/50 my-1"></div>
                    <button 
                      onClick={handleCerrarSesion}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {seccionActiva === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Usuarios Totales",
                    value: estadisticas.totalUsuarios,
                    change: "+12.4%",
                    trend: "up",
                    icon: Users,
                    color: "from-blue-600 to-blue-700",
                    bgColor: "bg-blue-50/50"
                  },
                  {
                    title: "Usuarios Activos",
                    value: estadisticas.usuariosActivos,
                    change: "+40.9%",
                    trend: "up",
                    icon: Activity,
                    color: "from-emerald-600 to-emerald-700",
                    bgColor: "bg-emerald-50/50"
                  },
                  {
                    title: "Administradores",
                    value: estadisticas.administradores,
                    change: "+84.7%",
                    trend: "up",
                    icon: Shield,
                    color: "from-purple-600 to-purple-700",
                    bgColor: "bg-purple-50/50"
                  },
                  {
                    title: "Nuevos Hoy",
                    value: estadisticas.nuevosHoy,
                    change: "-23.6%",
                    trend: "down",
                    icon: UserPlus,
                    color: "from-rose-600 to-rose-700",
                    bgColor: "bg-rose-50/50"
                  }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
                  return (
                    <div key={index} className={`${stat.bgColor} backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center text-sm font-medium ${
                          stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          <TrendIcon className="w-4 h-4 mr-1" />
                          {stat.change}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                        <p className="text-slate-600 text-sm">{stat.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Activity Chart */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Actividad de Usuarios</h2>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md hover:bg-blue-700 transition-colors">
                      Día
                    </button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                      Mes
                    </button>
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                      Año
                    </button>
                  </div>
                </div>
                <div className="h-64 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl flex items-center justify-center border border-slate-200/50">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">Gráfico de actividad de usuarios en tiempo real</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {seccionActiva === "usuarios" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Gestión de Usuarios</h1>
                  <p className="text-slate-600">Administra todos los usuarios del sistema</p>
                </div>
                <button
                  onClick={abrirModalCrear}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Usuario</span>
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar usuarios..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <select className="px-4 py-3 bg-slate-50/50 border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Todos los Roles</option>
                      <option>Administrador</option>
                      <option>Seminarista</option>
                      <option>Tesorero</option>
                      <option>Usuario Externo</option>
                    </select>
                    <select className="px-4 py-3 bg-slate-50/50 border border-slate-200/50 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Todos los Estados</option>
                      <option>Activo</option>
                      <option>Inactivo</option>
                      <option>Pendiente</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden">
                <TablaUsuarios
                  usuarios={usuariosFiltrados}
                  onEditar={abrirModalEditar}
                  onEliminar={eliminarUsuario}
                />
              </div>

              {/* Modal Usuario */}
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
          )}
      {/* Modal Perfil siempre disponible */}
      {mostrarPerfilModal && <div style={{position:'fixed',top:0,left:0,zIndex:9999,color:'red',fontWeight:'bold',fontSize:'2rem'}}>DEBUG: mostrarPerfilModal=true</div>}
      <PerfilModal
        mostrar={mostrarPerfilModal}
        usuario={usuarioActual}
        onClose={() => setMostrarPerfilModal(false)}
        onActualizar={handleActualizarPerfil}
        onCambiarPassword={handleCambiarPassword}
      />

          {/* Otros módulos con Lazy Loading */}
          {seccionActiva === "configuracion" && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Configuración del Sistema</h2>
              <p className="text-slate-600">Próximamente: Configuraciones del sistema</p>
            </div>
          )}

          <Suspense fallback={<PremiumLoader />}>
            {seccionActiva === "solicitudes" && <GestionSolicitudLazy />}
            {seccionActiva === "inscripciones" && <GestionIscripcionLazy />}
            {seccionActiva === "eventos" && <GestionEventosLazy />}
            {seccionActiva === "categorizacion" && <GestionCategorizacionLazy />}
            {seccionActiva === "tareas" && <GestionTareaLazy />}
            {seccionActiva === "cabanas" && <GestioCabañasLazy />}
            {seccionActiva === "reservas" && <GestionReservasLazy />}
            {seccionActiva === "programas-academicos" && <ProgramasAcademicosLazy />}
            {seccionActiva === "cursos" && <CursosLazy />}
            {seccionActiva === "programas-tecnicos" && <ProgramasTecnicosLazy />}
            {seccionActiva === "reportes" && <ReportesLazy />}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default PremiumDashboardAdmin;
