import PropTypes from 'prop-types';
import React, { useState, useRef, Suspense } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';
import {
  Users,
  BarChart3,
  UserPlus,
  Activity,
  TrendingUp,
  TrendingDown,
  Shield,
  Calendar as CalendarIcon,
  Sun,
  Moon
} from 'lucide-react';
import './Dashboard.css';
// Hooks optimizados
import { useDashboardAdmin } from './hooks/useDashboardAdmin';
import { useUsuariosAdmin } from './hooks/useUsuariosAdmin';
import { useTheme } from './hooks/useTheme';
// Componentes
import { PremiumLoader } from './LazyComponents';



const Dashboard = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp }) => {
  // Estados locales
  const [busqueda, setBusqueda] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const menuRef = useRef(null);

  // Hook para tema
  const { toggleTema, esTemaOscuro } = useTheme();

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
                      className={`stat-card-dashboard-admin glass-card ${stat.bgColor} rounded-2xl p-6 border border-white/20 shadow-lg fade-in-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg icon-bounce`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center text-sm font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
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



          {seccionActiva !== "dashboard" && seccionActiva !== "usuarios" && (
            <>
              {/* Debug - mostrar la sección activa */}
              <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded">
                <small>Debug: Sección activa = "{seccionActiva}"</small>
              </div>
              {/* Secciones no implementadas aún */}
              {!["programas-academicos", "eventos", "cabanas"].includes(seccionActiva) && (
                <div className="glass-card rounded-2xl p-8 border border-white/20 shadow-lg fade-in-up">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    {seccionActiva.charAt(0).toUpperCase() + seccionActiva.slice(1).replace('-', ' ')}
                  </h2>
                  <p className="text-slate-600">Esta sección está disponible con lazy loading para mejor rendimiento.</p>
                  <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded">
                    <small>Debug: Esta sección no está implementada aún. Sección: "{seccionActiva}"</small>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  usuario: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  onCerrarSesion: PropTypes.func
};

export default Dashboard;
