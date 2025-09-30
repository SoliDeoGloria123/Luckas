import  { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import "./DashboardTesorero.css";
import Header from './Header/Header-tesorero';
import Footer from '../footer/Footer';

const DashboardTesorero = () => {
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
  const handleGcursosClick =() =>{
    navigate('/tesorero/programas')
  };
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
              <button className="quick-action-btn-tesorero">
                <i className="fas fa-plus"></i>
                Acción Rápida
              </button>
            </div>
            <div className="dashboard-content">
              <section className="financial-metrics-tesorero">
                <div className="metric-card-tesorero income">
                  <div className="metric-icon-tesorero">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="metric-content-tesorero">
                    <div className="metric-value-tesorero">$45,231</div>
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
                    <div className="metric-value-tesorero">$28,450</div>
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
                    <div className="metric-value-tesorero">$16,781</div>
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
                        <span className="stat-number">156</span>
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
                        <span className="stat-number">156</span>
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
                        <span className="stat-number">23</span>
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
                        <span className="stat-number">8</span>
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
                        <span className="stat-number">12</span>
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
                        <span className="stat-number">12</span>
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
                        <span className="stat-number">15</span>
                        <span className="stat-label">activos</span>
                        <span className="stat-detail">245 inscritos</span>
                      </div>
                      <div className="function-info">
                        <h3>Gestionar Programas</h3>
                        <p>Administrar programas académicos</p>
                      </div>
                      <button className="function-action" onClick={handleGcursosClick}>
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
                        <span className="stat-number">34</span>
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
                        <span className="stat-number">67</span>
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
                        <span className="stat-number">25</span>
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
                    <button className="view-all-btn">Ver todas</button>
                  </div>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-indicator pending"></div>
                      <div className="activity-content">
                        <div className="activity-title">Nueva solicitud de permiso</div>
                        <div className="activity-subtitle">Juan Mendoza • Hace 2 horas</div>
                      </div>
                      <div className="activity-status pending">Pendiente</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-indicator completed"></div>
                      <div className="activity-content">
                        <div className="activity-title">Usuario registrado</div>
                        <div className="activity-subtitle">María García • Hace 4 horas</div>
                      </div>
                      <div className="activity-status completed">Completado</div>
                    </div>
                  </div>
                </div>

                <div className="system-stats">
                  <h3>Estadísticas del Sistema</h3>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span className="stat-label">Usuarios Activos</span>
                      <span className="stat-value">142</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Solicitudes Pendientes</span>
                      <span className="stat-value">23</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Eventos Este Mes</span>
                      <span className="stat-value">8</span>
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