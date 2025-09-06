import React, { useState, useRef } from 'react';
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

// Hooks optimizados
import { useDashboardAdmin } from './hooks/useDashboardAdmin';
import { useUsuariosAdmin } from './hooks/useUsuariosAdmin';

// Componentes
import UsuarioModal from "./Modales/UsuarioModal";
import TablaUsuarios from "./Tablas/UserTabla";
import { PremiumLoader } from './LazyComponents';

// Estilos
import './PremiumAnimations.css';

const OptimizedPremiumDashboard = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp }) => {
  // Estados locales
  const [busqueda, setBusqueda] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [mostrarMenu, setMostrarMenu] = useState(false);
  
  const menuRef = useRef(null);

  // Hook principal del dashboard
  const {
    usuarios,
    cargando,
    estadisticas,
    usuarioActual,
    setUsuarioActual,
    obtenerUsuarios,
    handleCerrarSesion
  } = useDashboardAdmin(usuarioProp, onCerrarSesionProp);

  // Hook para operaciones de usuarios
  const {
    mostrarModal,
    usuarioSeleccionado,
    setUsuarioSeleccionado,
    modoEdicion,
    nuevoUsuario,
    setNuevoUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal
  } = useUsuariosAdmin(obtenerUsuarios, usuarioActual, setUsuarioActual);

  // Configuración del menú
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

  // Filtros de usuarios
  const usuariosFiltrados = Array.isArray(usuarios)
    ? usuarios.filter(
        (user) =>
          user.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
          user.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
          user.role?.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];

  // Loading states
  if (cargando) {
    return <PremiumLoader />;
  }

  if (!usuarioActual && !usuarioProp) {
    return <PremiumLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Sidebar Premium con animaciones */}
      <div className={`fixed left-0 top-0 h-full glass-card border-r border-white/20 shadow-2xl transition-all duration-300 z-30 ${
        sidebarAbierto ? 'w-72' : 'w-20'
      }`}>
        {/* Logo con efecto shimmer */}
        <div className="p-6 border-b border-slate-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shimmer">
              <BookOpen className="w-6 h-6 text-white icon-bounce" />
            </div>
            {sidebarAbierto && (
              <div className="fade-in-up">
                <h1 className="text-xl font-bold text-slate-800">Luckas</h1>
                <p className="text-sm text-slate-500">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation con efectos premium */}
        <nav className="p-4 space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="fade-in-up" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
              {sidebarAbierto && (
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {section.section}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isActive = seccionActiva === item.id;
                  return (
                    <li key={item.id} style={{ animationDelay: `${(sectionIndex * 4 + itemIndex) * 0.05}s` }}>
                      <button
                        onClick={() => setSeccionActiva(item.id)}
                        className={`sidebar-item w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? 'active text-white shadow-lg' 
                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-5 h-5 icon-bounce ${isActive ? 'text-white' : item.color}`} />
                        {sidebarAbierto && (
                          <span className="font-medium">{item.label}</span>
                        )}
                        {isActive && sidebarAbierto && (
                          <div className="ml-auto w-2 h-2 bg-white rounded-full pulse-notification"></div>
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
        <header className="glass-card border-b border-slate-200/50 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarAbierto(!sidebarAbierto)}
                className="p-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 transition-all duration-300 icon-bounce"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="text-sm text-slate-500 fade-in-up">
                Dashboard / {seccionActiva.charAt(0).toUpperCase() + seccionActiva.slice(1)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search con efectos */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 glass-card border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Notifications con pulse */}
              <button className="relative p-2 rounded-xl glass-card text-slate-600 transition-all duration-300 icon-bounce">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full pulse-notification"></span>
              </button>

              {/* User Menu Premium */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMostrarMenu(!mostrarMenu)}
                  className="flex items-center space-x-3 p-2 rounded-xl glass-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shimmer">
                    {usuarioActual?.nombre?.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-800">{usuarioActual?.nombre}</p>
                    <p className="text-xs text-slate-500">Administrador</p>
                  </div>
                </button>

                {mostrarMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-xl border border-white/20 py-2 z-50 fade-in-up">
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-100/80 transition-colors">
                      Configuración
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-100/80 transition-colors">
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

        {/* Content con transiciones */}
        <main className="p-6 content-transition">
          {seccionActiva === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid con animaciones */}
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
                    <div 
                      key={index} 
                      className={`stat-card glass-card ${stat.bgColor} rounded-2xl p-6 border border-white/20 shadow-lg fade-in-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg icon-bounce`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center text-sm font-medium ${
                          stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
                        }`}>
                          <TrendIcon className="w-4 h-4 mr-1 icon-bounce" />
                          {stat.change}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1 stat-number">{stat.value}</h3>
                        <p className="text-slate-600 text-sm">{stat.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Activity Chart con efectos premium */}
              <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Actividad de Usuarios</h2>
                  <div className="flex space-x-2">
                    <button className="btn-premium px-4 py-2 text-white rounded-lg text-sm font-medium shadow-md">
                      Día
                    </button>
                    <button className="px-4 py-2 glass-card text-slate-600 rounded-lg text-sm font-medium hover:shadow-md transition-all">
                      Mes
                    </button>
                    <button className="px-4 py-2 glass-card text-slate-600 rounded-lg text-sm font-medium hover:shadow-md transition-all">
                      Año
                    </button>
                  </div>
                </div>
                <div className="h-64 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl flex items-center justify-center border border-slate-200/50 shimmer">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4 icon-bounce" />
                    <p className="text-slate-600">Gráfico de actividad de usuarios en tiempo real</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {seccionActiva === "usuarios" && (
            <div className="space-y-6 fade-in-up">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Gestión de Usuarios</h1>
                  <p className="text-slate-600">Administra todos los usuarios del sistema</p>
                </div>
                <button
                  onClick={abrirModalCrear}
                  className="btn-premium flex items-center space-x-2 px-4 py-2 text-white rounded-xl font-medium shadow-lg"
                >
                  <Plus className="w-4 h-4 icon-bounce" />
                  <span>Nuevo Usuario</span>
                </button>
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
              <div className="glass-card rounded-2xl border border-white/20 shadow-lg overflow-hidden user-card">
                <TablaUsuarios
                  usuarios={usuariosFiltrados}
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
                onClose={cerrarModal}
                onSubmit={modoEdicion ? actualizarUsuario : crearUsuario}
              />
            </div>
          )}

          {/* Placeholder para otras secciones */}
          {seccionActiva !== "dashboard" && seccionActiva !== "usuarios" && (
            <div className="glass-card rounded-2xl p-8 border border-white/20 shadow-lg fade-in-up">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                {seccionActiva.charAt(0).toUpperCase() + seccionActiva.slice(1).replace('-', ' ')}
              </h2>
              <p className="text-slate-600">Esta sección está disponible con lazy loading para mejor rendimiento.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OptimizedPremiumDashboard;
