import { useState, useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom';
import { userService } from "../../services/userService";
import UsuarioModal from "./Modales/UsuarioModal";
import TablaUsuarios from "./Tablas/UserTabla";
import GestionSolicitud from "./GestionSolicitud";
import Reportes from "./Reportes";
import ProgramasAcademicos from "./ProgramasAcademicos";
import Cursos from "./Cursos";
import ProgramasTecnicos from "./ProgramasTecnicos";
import GestionCategorizacion from "./GestionCategorizacion";
import GestionIscripcion from "./GestionIscripcion";
import GestionEventos from "./GestionEventos";
import GestionTarea from "./GestionTarea";
import GestioCabañas from "./GestioCabañas";
import GestionReservas from "./GestionReservas";
import { mostrarAlerta, mostrarConfirmacion } from '../utils/alertas';
import Footer from '../footer/Footer';
import "./Dashboard.css";


const Dashboard = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp, modoTesorero = false, userRole, readOnly = false, canCreate = true, canEdit = true, canDelete = true }) => {
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

  const handleCerrarSesion = () => {
    if (onCerrarSesionProp) {
      onCerrarSesionProp();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
  };


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
        handleCerrarSesion();
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
  const crearUsuario = async () => {
    try {
      if (window.event) window.event.preventDefault();
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
      mostrarAlerta("Error", `Error al crear el usuario: ${error.message}`);
    }
  };

  // Actualizar usuario
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
  //para cerrar la sesion 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
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

    <div className="dashboard-contenedor">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarAbierto ? "abierto" : "cerrado"}`}>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
        <div className="sidebar-header">
          <div className="logo">
            <i class="fas fa-book-open"></i>
            <span className="luckas">Luckas</span>
            <p class="subtitle">Panel del Adminsitrador</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={seccionActiva === "dashboard" ? "activo" : ""}>
              <a href="#" onClick={() => setSeccionActiva("dashboard")} className="nav-item-admin ">
                <i class="fas fa-tachometer-alt"></i>
                Dashboard
              </a>
            </li>
            <li className={seccionActiva === "usuarios" ? "activo" : ""}>
              <a href="#" onClick={() => setSeccionActiva("usuarios")} className="nav-item-admin">
                <i class="fas fa-users"></i>
                Usuarios
              </a>
            </li>
            <li className={seccionActiva === "configuracion" ? "activo" : ""}>
              <a href="#" onClick={() => setSeccionActiva("configuracion")} className="nav-item-admin">
                <i class="fas fa-cog"></i>
                Configuración
              </a>
            </li>
          </ul>

          <div className="nav-section-title">GESTIÓN ACADÉMICA</div>
          <ul>
            <li>
              <a href="#" onClick={() => setSeccionActiva("categorizacion")} className="nav-item-admin">
                <i class="fas fa-folder"></i>
                Categorizacion
              </a>
            </li>
            <li className={seccionActiva === "programas-academicos" ? "activo" : "has-submenu"} >
              <a href="#" onClick={() => setSeccionActiva("programas-academicos")} className="nav-item-admin">
                <i class="fas fa-graduation-cap"></i>
                Programas Académicos
                <i class="fas fa-chevron-down submenu-arrow"></i>
              </a>
              {/* Submenu para programas académicos */}
              <ul className="submenu">
                <li className={seccionActiva === "cursos" ? "activo" : ""}>
                  <a href="#" onClick={() => setSeccionActiva("cursos")} className="nav-item-admin">
                    <i class="fas fa-book"></i>
                    Cursos
                  </a>
                </li>
                <li className={seccionActiva === "programas-tecnicos" ? "activo" : ""}>
                  <a href="#" onClick={() => setSeccionActiva("programas-tecnicos")} className="nav-item-admin">
                    <i class="fas fa-file-alt"></i>
                    Prog. Técnicos
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#" onClick={() => setSeccionActiva("eventos")} className="nav-item-admin">
                <i class="fas fa-calendar-alt"></i>
                Eventos
              </a>
            </li>
          </ul>
          <div className="nav-section-title">ADMINISTRACIÓN</div>
          <ul>
            <li>
              <a href="#" onClick={() => setSeccionActiva("solicitudes")} className="nav-item-admin">
                <i class="fas fa-envelope-open-text"></i>
                Solicitudes
              </a>
            </li>
            <li>
              <a href="#" onClick={() => setSeccionActiva("inscripciones")} className="nav-item-admin">
                <i class="fas fa-user-plus"></i>
                Inscripciones
              </a>
            </li>
            <li>
              <a href="#" onClick={() => setSeccionActiva("tareas")} className="nav-item-admin">
                <i class="fas fa-check-square"></i>
                Tareas
              </a>
            </li>
          </ul>
          <div className="nav-section-title">SERVICIOS</div>
          <ul>
            <li>
              <a href="#" onClick={() => setSeccionActiva("cabanas")} className="nav-item-admin">
                <i class="fas fa-home"></i>
                Cabañas
              </a>
            </li>
            <li>
              <a href="#" onClick={() => setSeccionActiva("reservas")} className="nav-item-admin">
                <i class="fas fa-calendar-check"></i>
                Reservas
              </a>
            </li>
            <li>
              <a href="#" onClick={() => setSeccionActiva("reportes")} className="nav-item-admin">
                <i class="fas fa-chart-line"></i>
                Reportes
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="contenido-principal">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-izquierda">
            <button className="btn-menu" onClick={() => setSidebarAbierto(!sidebarAbierto)}>
              <i class="fas fa-bars"></i>
            </button>
            <div className="breadcrumb">
              <span>Inicio</span>
              <span>/</span>
              <span>{seccionActiva === "dashboard" ? "Dashboard" : "Usuarios"}</span>
            </div>
          </div>

          <div className="admin-header-derecha">
            <div className="admin-notificaciones">
              <i class="fas fa-bell"></i>
              <span className="badge">3</span>
            </div>

            <div className="usuario-info-admin">
              <div className="user-avatar-dropdown" ref={menuRef}>
                <button className="user-avatar" onClick={() => setMostrarMenu(!mostrarMenu)}>
                  {usuarioActual?.nombre?.substring(0, 2).toUpperCase()}
                </button>
                {mostrarMenu && (
                  <div className="despegable-menu-admin">
                    <span className="despegable-header-admin">{usuarioActual?.nombre}</span>
                    <button className="despegable-item">Configuración</button>
                    <button className="despegable-item">Perfil</button>
                    <button className="despegable-item" onClick={handleLogout}>Cerrar sesión</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="contenido">
          {seccionActiva === "dashboard" && (
<<<<<<< Updated upstream
            <>
              {/* Tarjetas de Estadísticas */}
              <div className="estadisticas-grid">
                <div className="tarjeta-stat morada">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.totalUsuarios}</div>
                    <div className="stat-label">Usuarios Totales</div>
                    <div className="stat-cambio positivo">+12.4% ↑</div>
                  </div>
                  <div className="stat-grafico">📈</div>
                </div>

                <div className="tarjeta-stat azul">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.usuariosActivos}</div>
                    <div className="stat-label">Usuarios Activos</div>
                    <div className="stat-cambio positivo">+40.9% ↑</div>
                  </div>
                  <div className="stat-grafico">👥</div>
                </div>

                <div className="tarjeta-stat naranja">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.administradores}</div>
                    <div className="stat-label">Administradores</div>
                    <div className="stat-cambio positivo">+84.7% ↑</div>
                  </div>
                  <div className="stat-grafico">🛡️</div>
                </div>

                <div className="tarjeta-stat roja">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.nuevosHoy}</div>
                    <div className="stat-label">Nuevos Hoy</div>
                    <div className="stat-cambio negativo">-23.6% ↓</div>
                  </div>
                  <div className="stat-grafico">📊</div>
                </div>
=======
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
>>>>>>> Stashed changes
              </div>

              {/* Gráfico de Actividad */}
              <div className="tarjeta-grafico">
                <div className="grafico-header">
                  <h3>Actividad de Usuarios</h3>
                  <div className="grafico-controles">
                    <button className="btn-periodo activo">Día</button>
                    <button className="btn-periodo">Mes</button>
                    <button className="btn-periodo">Año</button>
                  </div>
                </div>
                <div className="grafico-placeholder">
                  <div className="grafico-linea"></div>
                  <p>Gráfico de actividad de usuarios en tiempo real</p>
                </div>
              </div>
            </>
          )}

          {seccionActiva === "usuarios" && (
            <div className="seccion-usuarios">
              <div className="page-header-Academicos">
                <div className="page-title-admin">
                  <h1>Gestión de Usuarios</h1>
                  <p>Administra las cuentas de usuario del sistema</p>
                </div>
                {!readOnly && (
                  <button className="btn-admin btn-primary-admin" onClick={abrirModalCrear}>
                    <i className="fas fa-plus"></i> Nuevo Usuario
                  </button>
                )}
              </div>

              <div className="stats-grid-admin">
                <div className="stat-card-admin">
                  <div className="stat-icon-admin users">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info-admin">
                    <h3>5</h3>
                    <p>Total Usuarios</p>
                  </div>
                </div>
                <div className="stat-card-admin">
                  <div className="stat-icon-admin active">
                    <i className="fas fa-user-check"></i>
                  </div>
                  <div className="stat-info-admin">
                    <h3>4</h3>
                    <p>Usuarios Activos</p>
                  </div>
                </div>
                <div className="stat-card-admin">
                  <div className="stat-icon-admin admins">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="stat-info-admin">
                    <h3>1</h3>
                    <p>Administradores</p>
                  </div>
                </div>
                <div className="stat-card-admin">
                  <div className="stat-icon-admin new">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <div className="stat-info-admin">
                    <h3>12</h3>
                    <p>Nuevos Este Mes</p>
                  </div>
                </div>
              </div>


              <section className="filtros-section-admin">
                <div className="busqueda-contenedor">
                  <i class="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}

                  />
                </div>
                <div className="filtro-grupo-admin">
                  <select className="filtro-dropdown">
                    <option>Todos los Roles</option>
                    <option>Administrador</option>
                    <option>Seminarista</option>
                    <option>Tesorero</option>
                    <option>Usuario Externo</option>
                  </select>
                  <select className="filtro-dropdown">
                    <option>Todos los Estados</option>
                    <option>Activo</option>
                    <option>Inactivo</option>
                    <option>Pendiente</option>
                  </select>
                </div>
              </section>
              <TablaUsuarios
                usuarios={usuariosFiltrados}
                onEditar={readOnly ? null : abrirModalEditar}
                onEliminar={(modoTesorero || readOnly) ? null : eliminarUsuario}
              />
              <UsuarioModal
                mostrar={mostrarModal && seccionActiva === "usuarios"}
                modoEdicion={modoEdicion}
                usuarioSeleccionado={usuarioSeleccionado}
                setUsuarioSeleccionado={setUsuarioSeleccionado}
                nuevoUsuario={nuevoUsuario}
                setNuevoUsuario={setNuevoUsuario}
                onClose={() => setMostrarModal(false)}
                onSubmit={modoEdicion ? actualizarUsuario : crearUsuario}
              />
              <div class="pagination-admin">
                <button class="pagination-btn-admin" disabled>
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="pagination-info-admin">Página 1 de 1</span>
                <button class="pagination-btn-admin" disabled>
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

          )}
          {seccionActiva === "configuracion" && (
            <div className="seccion-configuracion">
              <h2>Configuración del Sistema</h2>
              <p>Próximamente: Configuraciones del sistema</p>
            </div>
          )}
          {seccionActiva === "solicitudes" && (

            <GestionSolicitud />

          )}

          {seccionActiva === "inscripciones" && (
            <GestionIscripcion />
          )}

          {seccionActiva === "eventos" && (
            <GestionEventos />
          )}
          {seccionActiva === "categorizacion" && (
            <GestionCategorizacion />
          )}
          {seccionActiva === "tareas" && (
            <GestionTarea
              readOnly={readOnly}
              modoTesorero={modoTesorero}
              canCreate={canCreate}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          )}
          {seccionActiva === "cabanas" && (
            <GestioCabañas
            />
          )}
          {seccionActiva === "reservas" && (
            <GestionReservas
              readOnly={readOnly}
              modoTesorero={modoTesorero}
              canCreate={canCreate}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          )}

          {seccionActiva === "programas-academicos" && (
            <div className="seccion-programas-academicos">
              <ProgramasAcademicos />
            </div>
          )}

          {seccionActiva === "cursos" && (
            <div className="seccion-cursos">
              <Cursos />
            </div>
          )}

          {seccionActiva === "programas-tecnicos" && (
            <div className="seccion-programas-tecnicos">
              <ProgramasTecnicos />
            </div>
          )}

          {seccionActiva === "reportes" && (
            <div className="seccion-reportes">
              <Reportes />
            </div>
          )}

        </main>
      <Footer/>
      </div>
    </div>

  )
}
export default Dashboard