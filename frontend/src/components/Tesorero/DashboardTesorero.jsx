import  { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import "./DashboardTesorero.css";
import Header from './Header/Header-tesorero';
import { userService } from '../../services/userService';
import { categorizacionService } from '../../services/categorizacionService';
import { solicitudService } from '../../services/solicirudService';
import { eventService } from '../../services/eventService';
import { cabanaService } from '../../services/cabanaService';
import { reservaService } from '../../services/reservaService';
import { cursosService } from '../../services/cursosService';
import { tareaService } from '../../services/tareaService';
import { inscripcionService } from '../../services/inscripcionService';
import { reporteService } from '../../services/reporteService';
import Footer from '../footer/Footer';

const DashboardTesorero = () => {
  // Estado para actividad reciente
  const [actividad, setActividad] = useState([]);
  // Estados para los conteos
  const [stats, setStats] = useState({
    usuarios: 0,
    categorias: 0,
    solicitudes: 0,
    eventos: 0,
    cabanas: 0,
    reservas: 0,
    cursos: 0,
    tareas: 0,
    inscripciones: 0,
    reportes: 0
  });

  useEffect(() => {
    // Obtener actividad reciente (últimas acciones de usuarios)
    reporteService.getActividadUsuarios().then(res => {
      if (res.success && res.data) {
        // Unificar y ordenar por fecha
        const acciones = [];
        res.data.reservas.datos.forEach(r => acciones.push({ tipo: 'Reserva', ...r }));
        res.data.inscripciones.datos.forEach(i => acciones.push({ tipo: 'Inscripción', ...i }));
        res.data.solicitudes.datos.forEach(s => acciones.push({ tipo: 'Solicitud', ...s }));
        acciones.sort((a, b) => new Date(b.createdAt || b.fechaSolicitud || b.fecha) - new Date(a.createdAt || a.fechaSolicitud || a.fecha));
        setActividad(acciones.slice(0, 6)); // Solo las 6 más recientes
      }
    }).catch(()=>{});
    userService.getAllUsers().then(res => setStats(s => ({ ...s, usuarios: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
    categorizacionService.getAll().then(res => setStats(s => ({ ...s, categorias: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
    solicitudService.getAll().then(res => setStats(s => ({ ...s, solicitudes: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
    eventService.getAllEvents().then(res => setStats(s => ({ ...s, eventos: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
    cabanaService.getAll().then(res => setStats(s => ({ ...s, cabanas: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
    reservaService.getAll().then(res => setStats(s => ({ ...s, reservas: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
    cursosService.obtenerCursos().then(res => setStats(s => ({ ...s, cursos: Array.isArray(res) ? res.length : 0 }))).catch(()=>{});
    tareaService.getAll().then(res => setStats(s => ({ ...s, tareas: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
    inscripcionService.getAll().then(res => setStats(s => ({ ...s, inscripciones: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
    reporteService.getDashboard().then(res => setStats(s => ({ ...s, reportes: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState("dashboard");

  const handleGusuariosClick =() =>{
    navigate('/tesorero/usuarios')
  };
  const handleGcategoriasClick =() =>{
    navigate('/tesorero/categorias')
  };

  const handleGsolicitudesClick =() =>{
    navigate('/tesorero/solicitudes')
  };
  const handleEventosClick =() =>{
    navigate('/tesorero/eventos')
  };
  const handleGcabanaClick =() =>{
    navigate('/tesorero/cabañas')
  };
  const handleGreservasClick =() =>{
    navigate('/tesorero/reservas')
  };
  /*const handleGcursosClick =() =>{
    navigate('/tesorero/cursos')
  };*/
  const handleGinscripcionClick =() =>{
    navigate('/tesorero/inscripcion')
  };
  const handleGreporteClick =() =>{
    navigate('/tesorero/reportes')
  };
  const handleGtareaClick =() =>{
    navigate('/tesorero/tarea')
  };


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

 

  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuarioStorage || !token) {
      navigate('/login');
      return;
    }

    const usuarioData = JSON.parse(usuarioStorage);

    if (usuarioData.role !== 'tesorero') {
      navigate(usuarioData.role === 'admin' ? '/admin/users' : '/login');
      return;
    }
    setUsuario(usuarioData);
  }, [navigate]);

  if (!usuario) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <div className="dashboard-tesorero">
      <Header usuario={usuario} />
      <main className="main-content-tesorero">
        {seccionActiva === "dashboard" && (
          <>
            <div className="dashboard-header-tesorero">
              <div className="dashboard-title-tesorero">
                <h1>Dashboard Principal</h1>
                <p>Gestiona recursos y administra el sistema eficientemente</p>
              </div>
              <button className="quick-action-btn-tesorero" onClick={() => navigate('/tesorero/inscripcion')}>
                <i className="fas fa-plus"></i>
                Nueva Inscripción
              </button>
            </div>
            <div className="dashboard-content">
              <section className="financial-metrics-tesorero">
                <div className="metric-card-tesorero income">
                  <div className="metric-icon-tesorero">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="metric-content-tesorero">
                    <div className="metric-value-tesorero">$ {stats.ingresos || '---'}</div>
                    <div className="metric-label-tesorero">Ingresos Totales</div>
                    <div className="metric-trend-tesorero positive">
                      <i className="fas fa-arrow-up"></i>
                      +15%
                    </div>
                  </div>
                </div>

                <div className="metric-card-tesorero expenses">
                  <div className="metric-icon-tesorero">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="metric-content-tesorero">
                    <div className="metric-value-tesorero">$ {stats.gastos || '---'}</div>
                    <div className="metric-label-tesorero">Gastos Operativos</div>
                    <div className="metric-trend-tesorero positive">
                      <i className="fas fa-arrow-up"></i>
                      +8%
                    </div>
                  </div>
                </div>

                <div className="metric-card-tesorero balance">
                  <div className="metric-icon-tesorero">
                    <i className="fas fa-balance-scale"></i>
                  </div>
                  <div className="metric-content-tesorero">
                    <div className="metric-value-tesorero">$ {stats.balance || '---'}</div>
                    <div className="metric-label-tesorero">Balance Neto</div>
                    <div className="metric-trend-tesorero positive">
                      <i className="fas fa-arrow-up"></i>
                      +22%
                    </div>
                  </div>
                </div>
              </section>

              <section className="admin-functions">
                <h2>Funciones Administrativas</h2>
                <div className="functions-grid">
                  <div className={ seccionActiva === "usuarios-tesorero" ? "activo" : "function-card"} data-function="usuarios-tesorero">
                    <div className="function-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="function-content">
                      <div className="function-stats">
                        <span className="stat-number">{stats.usuarios}</span>
                        <span className="stat-label">usuarios</span>
                        <span className="stat-detail">+12 este mes</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Usuarios</h3>
                        <p>Administrar cuentas de usuarios del sistema</p>
                      </div>
                      <button className="function-action" onClick={handleGusuariosClick} >
                        Gestionar →
                      </button>
                    </div>
                  </div>
                  <div className={ seccionActiva === "categorias-tesorero" ? "activo" : "function-card"} data-function="categorias-tesorero">
                    <div className="function-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="function-content">
                      <div className="function-stats">
                        <span className="stat-number">{stats.categorias}</span>
                        <span className="stat-label">usuarios</span>
                        <span className="stat-detail">+12 este mes</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Categorias</h3>
                        <p>Administrar Categorias del sistema</p>
                      </div>
                      <button className="function-action" onClick={handleGcategoriasClick} >
                        Gestionar →
                      </button>
                    </div>
                  </div>

                  <div className= { seccionActiva === "solicitud-tesorero" ? "activo" : "function-card"} data-function="solicitud-tesorero">
                    <div className="function-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="function-content">
                      <div className="function-stats">
                        <span className="stat-number">{stats.solicitudes}</span>
                        <span className="stat-label">pendientes</span>
                        <span className="stat-detail">5 nuevas hoy</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Solicitudes</h3>
                        <p>Revisar y categorizar solicitudes</p>
                      </div>
                      <button className="function-action " onClick={handleGsolicitudesClick}>
                        Gestionar →
                      </button>
                    </div>
                  </div>

                  <div className={ seccionActiva === "evento-tesorero" ? "activo" : "function-card"} data-function="evento-tesorero" >
                    <div className="function-icon">
                      <i className="fas fa-calendar"></i>
                    </div>
                    <div className="function-content">
                      <div className="function-stats">
                        <span className="stat-number">{stats.eventos}</span>
                        <span className="stat-label">próximos</span>
                        <span className="stat-detail">2 esta semana</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Eventos</h3>
                        <p>Organizar y categorizar eventos</p>
                      </div>
                      <button className="function-action" onClick={handleEventosClick}>
                        Gestionar →
                      </button>
                    </div>
                  </div>

                  <div className={ seccionActiva === "cabana-tesorero" ? "activo" : "function-card"} data-function="cabana-tesorero">
                    <div className="function-icon">
                      <i className="fas fa-home"></i>
                    </div>
                    <div className="function-content">
                      <div className="function-stats">
                        <span className="stat-number">{stats.cabanas}</span>
                        <span className="stat-label">disponibles</span>
                        <span className="stat-detail">85% ocupación</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Cabañas</h3>
                        <p>Administrar las cabañas</p>
                      </div>
                      <button className="function-action" onClick={handleGcabanaClick}>
                        Gestionar →
                      </button>
                    </div>
                  </div>
                  <div className={ seccionActiva === "reserva-tesorero" ? "activo" : "function-card"} data-function="reserva-tesorero">
                    <div className="function-icon">
                      <i className="fas fa-home"></i>
                    </div>
                    <div className="function-content">
                      <div className="function-stats">
                        <span className="stat-number">{stats.reservas}</span>
                        <span className="stat-label">disponibles</span>
                        <span className="stat-detail">85% ocupación</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Reservas</h3>
                        <p>Administrar reservas de cabañas</p>
                      </div>
                      <button className="function-action" onClick={handleGreservasClick}>
                        Gestionar →
                      </button>
                    </div>
                  </div>

                  <div className={ seccionActiva === "curso-tesorero" ? "activo" : "function-card"} data-function="curso-tesorero">
                    <div className="function-icon">
                      <i className="fas fa-book"></i>
                    </div>
                    <div className="function-content">
                      <div className="function-stats">
                        <span className="stat-number">{stats.cursos}</span>
                        <span className="stat-label">activos</span>
                        <span className="stat-detail">245 inscritos</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Cursos</h3>
                        <p>Administrar programas académicos</p>
                      </div>
                      <button className="function-action" >
                        Gestionar →
                      </button>
                    </div>
                  </div>

                  <div  className={ seccionActiva === "tarea-tesorero" ? "activo" : "function-card"} data-function="tarea-tesorero">
                    <div className="function-icon">
                      <i className="fas fa-tasks"></i>
                    </div>
                    <div className="function-content">
                      <div className="function-stats">
                        <span className="stat-number">{stats.tareas}</span>
                        <span className="stat-label">activas</span>
                        <span className="stat-detail">12 completadas</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Tareas</h3>
                        <p>Asignar y supervisar tareas</p>
                      </div>
                      <button className="function-action" onClick={handleGtareaClick}>
                        Gestionar →
                      </button>
                    </div>
                  </div>

                  <div className={ seccionActiva === "inscripcion-tesorero" ? "activo" : "function-card"} data-function="inscripcion-tesorero">
                    <div className="function-icon">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="function-content">
                      <div className="function-stats">
                        <span className="stat-number">{stats.inscripciones}</span>
                        <span className="stat-label">nuevas</span>
                        <span className="stat-detail">+18 esta semana</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Inscripciones</h3>
                        <p>Procesar inscripciones y categorizar</p>
                      </div>
                      <button className="function-action" onClick={handleGinscripcionClick}>
                        Gestionar →
                      </button>
                    </div>
                  </div>

                  <div  className={ seccionActiva === "reportes-tesorero" ? "activo" : "function-card"} data-function="reportes-tesorero">
                    <div className="function-icon">
                      <i className="fas fa-chart-bar"></i>
                    </div>
                    <div className="function-content">
                      <div className="function-stats">
                        <span className="stat-number">{stats.reportes}</span>
                        <span className="stat-label">reportes</span>
                        <span className="stat-detail">Actualizado hoy</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Reportes</h3>
                        <p>Generar informes del sistema</p>
                      </div>
                      <button className="function-action" onClick={handleGreporteClick}>
                        Gestionar →
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bottom-section">
                <div className="recent-activity">
                  <div className="section-header">
                    <h3>Actividad Reciente</h3>
                    <button className="view-all-btn" onClick={() => navigate('/tesorero/reportes')}>Ver todas</button>
                  </div>
                  <div className="activity-list">
                    {actividad.length === 0 ? (
                      <div className="activity-item">
                        <div className="activity-content">
                          <div className="activity-title">Sin actividad reciente</div>
                        </div>
                      </div>
                    ) : (
                      actividad.map((item, idx) => (
                        <div className="activity-item" key={item._id || idx}>
                          <div className={`activity-indicator ${item.tipo === 'Solicitud' ? 'pending' : 'completed'}`}></div>
                          <div className="activity-content">
                            <div className="activity-title">
                              {item.tipo === 'Solicitud' ? `Solicitud: ${item.estado}` : item.tipo === 'Reserva' ? `Reserva en ${item.cabana?.nombre || 'Cabaña'}` : item.tipo === 'Inscripción' ? `Inscripción a ${item.evento?.name || 'Evento'}` : item.tipo}
                            </div>
                            <div className="activity-subtitle">
                              {item.usuario?.username || item.solicitante?.username || 'Usuario'} • {new Date(item.createdAt || item.fechaSolicitud || item.fecha).toLocaleString()}
                            </div>
                          </div>
                          <div className={`activity-status ${item.tipo === 'Solicitud' ? 'pending' : 'completed'}`}>{item.tipo}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="system-stats">
                  <h3>Estadísticas del Sistema</h3>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span className="stat-label">Usuarios Activos</span>
                      <span className="stat-value">{stats.usuarios}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Solicitudes Pendientes</span>
                      <span className="stat-value">{stats.solicitudes}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Eventos Este Mes</span>
                      <span className="stat-value">{stats.eventos}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Ocupación Cabañas</span>
                      <span className="stat-value highlight">85%</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
       
      </main>
      <Footer />
    </div>
  );
};

export default DashboardTesorero;