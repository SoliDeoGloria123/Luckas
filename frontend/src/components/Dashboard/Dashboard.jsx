import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
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

} from 'lucide-react';
import './Dashboard.css';
// Hooks optimizados
import { useDashboardAdmin } from './hooks/useDashboardAdmin';
import { eventService } from '../../services/eventService';
import { programasAcademicosService } from '../../services/programasAcademicosService';


// Componentes
import { PremiumLoader } from './LazyComponents';



const Dashboard = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp }) => {
  // Estados locales
  //const [busqueda] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [seccionActiva, setSeccionActiva] = useState("dashboard");

  // Hook principal del dashboard
  const {
    cargando,
    estadisticas,
    usuarioActual,
    usuarios
  } = useDashboardAdmin(usuarioProp, onCerrarSesionProp);

  const [eventosRecientes, setEventosRecientes] = useState([]);
  const [programasRecientes, setProgramasRecientes] = useState([]);

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString();
    } catch (e) {
      return '';
    }
  };

  const displayValue = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return String(val);
    // If it's an object, try common fields
    if (typeof val === 'object') {
      if (val.nombre) return String(val.nombre);
      if (val.titulo) return String(val.titulo);
      if (val.correo) return String(val.correo);
      try {
        return JSON.stringify(val);
      } catch (e) {
        return String(val);
      }
    }
    return String(val);
  };

  useEffect(() => {
    let mounted = true;
    const fetchRecientes = async () => {
      try {
        const ev = await eventService.getAllEvents();
        const evArr = Array.isArray(ev) ? ev : (ev && ev.data) || [];
        const sortedE = evArr.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
        if (mounted) setEventosRecientes(sortedE);

        const pr = await programasAcademicosService.getAllProgramas();
        const prArr = Array.isArray(pr) ? pr : (pr && pr.data) || [];
        const sortedP = prArr.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
        if (mounted) setProgramasRecientes(sortedP);
      } catch (error) {
        console.error('Error cargando recientes del dashboard:', error);
      }
    };

    fetchRecientes();
    return () => { mounted = false; };
  }, []);

  // Hook para operaciones de usuarios (comentado porque no se usa actualmente)
  // const {
  //   mostrarModal,
  //   usuarioSeleccionado,
  //   setUsuarioSeleccionado,
  //   modoEdicion,
  //   nuevoUsuario,
  //   setNuevoUsuario,
  //   crearUsuario,
  //   actualizarUsuario,
  //   eliminarUsuario,
  //   abrirModalCrear,
  //   abrirModalEditar,
  //   cerrarModal
  // } = useUsuariosAdmin(obtenerUsuarios, usuarioActual, setUsuarioActual);

  // Configuración del menú


  // Filtros de usuarios (comentado porque no se usa actualmente)
  // const usuariosFiltrados = Array.isArray(usuarios)
  //   ? usuarios.filter(
  //     (user) =>
  //       user.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
  //       user.correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
  //       user.role?.toLowerCase().includes(busqueda.toLowerCase())
  //   )
  //   : [];

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
                      key={stat.title}
                      className={`stat-card-dashboard-admin glass-card ${stat.bgColor} rounded-2xl p-6 border border-white/20 fade-in-up bg-white/60 dark:bg-gray-800/50 backdrop-blur-sm`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg icon-bounce` + ' ' + 'shadow-blue-lg'}>
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
              {/* Recientes: usuarios, eventos y programas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg fade-in-up col-span-1 md:col-span-1">
                  <div className="card-header flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Usuarios recientes</h3>
                    <button className={`card-action inline-flex px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm`} onClick={() => setSeccionActiva('usuarios')}>Ver todos</button>
                  </div>
                  <ul className="usuarios-recientes-list space-y-3 bg-white/5 p-2 rounded-lg">
                    {(Array.isArray(usuarios) ? usuarios.slice(0, 6) : []).map((u) => {
                      const label = displayValue(u.nombre || u.correo || u.email || u.username || 'U');
                      const avatarChar = label && label.length ? label.charAt(0).toUpperCase() : 'U';
                      return (
                        <li key={u._id || u.id || displayValue(u)} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full avatar-gradient flex items-center justify-center text-white font-medium">{avatarChar}</div>
                            <div>
                              <div className="font-medium text-slate-800">{label}</div>
                              <div className="text-xs text-slate-500">{formatDate(u.createdAt)}</div>
                            </div>
                          </div>
                          <div className="text-sm text-slate-500">{displayValue(u.role) || ''}</div>
                        </li>
                      );
                    })}
                    {(!usuarios || usuarios.length === 0) && (
                      <li className="text-slate-500">No hay usuarios recientes</li>
                    )}
                  </ul>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg fade-in-up col-span-2">
                  <div className="card-header flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Últimos eventos y programas</h3>
                    <div>
                      <button className={`card-action inline-flex px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm mr-2`} onClick={() => setSeccionActiva('eventos')}>Ver eventos</button>
                      <button className={`card-action inline-flex px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-sm`} onClick={() => setSeccionActiva('programas-academicos')}>Ver programas</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-2">Eventos</h4>

                      <ul className="recientes-list space-y-2 bg-white/5 p-2 rounded-lg">
                        {eventosRecientes.length > 0 ? eventosRecientes.map((ev) => (
                          <li key={ev._id || ev.id || displayValue(ev)} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-slate-800">{displayValue(ev.titulo || ev.nombre) || 'Evento'}</div>
                              <div className="text-xs text-slate-500">{formatDate(ev.createdAt)}</div>
                            </div>
                            <div className="text-xs text-slate-500">{displayValue(ev.categoria) || ''}</div>
                          </li>
                        )) : <li className="text-slate-500">No hay eventos</li>}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-2">Programas</h4>
                      <ul className="recientes-list space-y-2 bg-white/5 p-2 rounded-lg">
                        {programasRecientes.length > 0 ? programasRecientes.map((p) => (
                          <li key={p._id || p.id || displayValue(p)} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-slate-800">{displayValue(p.titulo || p.nombre || p.nombrePrograma) || 'Programa'}</div>
                              <div className="text-xs text-slate-500">{formatDate(p.createdAt)}</div>
                            </div>
                            <div className="text-xs text-slate-500">{displayValue(p.modalidad) || ''}</div>
                          </li>
                        )) : <li className="text-slate-500">No hay programas</li>}
                      </ul>
                    </div>
                  </div>
                </div>
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
