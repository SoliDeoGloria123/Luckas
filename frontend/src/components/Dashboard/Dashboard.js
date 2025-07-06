import { useState, useEffect } from "react"
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
import "./Dashboard.css";


const Dashboard = ({ usuario: usuarioProp, onCerrarSesion: onCerrarSesionProp, modoTesorero = false, userRole, readOnly = false, canCreate = true, canEdit = true, canDelete = true }) => {

  

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
      await userService.createUser(nuevoUsuario);
      alert("Usuario creado exitosamente");
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
      alert(`Error al crear el usuario: ${error.message}`);
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
      alert("Usuario actualizado exitosamente");
      setMostrarModal(false);
      setUsuarioSeleccionado(null);
      setModoEdicion(false);
      obtenerUsuarios();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (userId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      return;
    }
    try {
      await userService.deleteUser(userId);
      alert("Usuario eliminado exitosamente");
      obtenerUsuarios();
    } catch (error) {
      alert(`Error: ${error.message}`);
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
            <span className="luckas">Luckas</span><span className="ent">ent</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-seccion">
            <div className="nav-titulo">PRINCIPAL</div>
            <ul>
              <li className={seccionActiva === "dashboard" ? "activo" : ""}>
                <a href="#" onClick={() => setSeccionActiva("dashboard")}>
                  <span className="nav-icon">📊</span>
                  <span className="nav-texto">Dashboard</span>
                </a>
              </li>
              <li className={seccionActiva === "usuarios" ? "activo" : ""}>
                <a href="#" onClick={() => setSeccionActiva("usuarios")}>
                  <span className="nav-icon">👥</span>
                  <span className="nav-texto">Usuarios</span>
                </a>
              </li>
              <li className={seccionActiva === "configuracion" ? "activo" : ""}>
                <a href="#" onClick={() => setSeccionActiva("configuracion")}>
                  <span className="nav-icon">⚙️</span>
                  <span className="nav-texto">Configuración</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="nav-seccion">
            <div className="nav-titulo">GESTIÓN ACADÉMICA</div>
            <ul>
              <li>
                <a href="#" onClick={() => setSeccionActiva("categorizacion")}>
                  <span className="nav-icon">🗂️</span>
                  <span className="nav-texto">Categorizacion</span>
                </a>
              </li>
              <li className={seccionActiva === "programas-academicos" ? "activo" : ""}>
                <a href="#" onClick={() => setSeccionActiva("programas-academicos")}>
                  <span className="nav-icon">🎓</span>
                  <span className="nav-texto">Programas Académicos</span>
                </a>
                {/* Submenu para programas académicos */}
                <ul className="submenu">
                  <li className={seccionActiva === "cursos" ? "activo" : ""}>
                    <a href="#" onClick={() => setSeccionActiva("cursos")}>
                      <span className="nav-icon">📚</span>
                      <span className="nav-texto">Cursos</span>
                    </a>
                  </li>
                  <li className={seccionActiva === "programas-tecnicos" ? "activo" : ""}>
                    <a href="#" onClick={() => setSeccionActiva("programas-tecnicos")}>
                      <span className="nav-icon">🔧</span>
                      <span className="nav-texto">Prog. Técnicos</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("eventos")}>
                  <span className="nav-icon">📅</span>
                  <span className="nav-texto">Eventos</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="nav-seccion">
            <div className="nav-titulo">ADMINISTRACIÓN</div>
            <ul>
              <li>
                <a href="#" onClick={() => setSeccionActiva("solicitudes")}>
                  <span className="nav-icon">📨</span>
                  <span className="nav-texto">Solicitudes</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("inscripciones")}>
                  <span className="nav-icon">📝</span>
                  <span className="nav-texto">Inscripciones</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("tareas")}>
                  <span className="nav-icon">✅</span>
                  <span className="nav-texto">Tareas</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="nav-seccion">
            <div className="nav-titulo">SERVICIOS</div>
            <ul>
              <li>
                <a href="#" onClick={() => setSeccionActiva("cabanas")}>
                  <span className="nav-icon">🛖</span>
                  <span className="nav-texto">Cabañas</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("reservas")}>
                  <span className="nav-icon">📅</span>
                  <span className="nav-texto">Reservas</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => setSeccionActiva("reportes")}>
                  <span className="nav-icon">📈</span>
                  <span className="nav-texto">Reportes</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <div className="contenido-principal">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-izquierda">
            <button className="btn-menu" onClick={() => setSidebarAbierto(!sidebarAbierto)}>
              ☰
            </button>
            <div className="breadcrumb">
              <span>Inicio</span>
              <span>/</span>
              <span>{seccionActiva === "dashboard" ? "Dashboard" : "Usuarios"}</span>
            </div>
          </div>

          <div className="admin-header-derecha">
            <div className="admin-notificaciones">
              <span className="notif-icon">🔔</span>
              <span className="notif-badge">3</span>

            </div>
            <div className="usuario-info">
              <div className="admi-avatar">{usuarioActual?.nombre?.substring(0, 2).toUpperCase()}</div>
              <span className="admin-nombre">{usuarioActual?.nombre}</span>
              <button className="admin-btn-logout" onClick={handleLogout}>
                Cerrar sesión
              </button>

            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="contenido">
          {seccionActiva === "dashboard" && (
            <>
              {/* Tarjetas de Estadísticas */}
              <div className="estadisticas-grid">
                <div className="tarjeta-stat morada">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.totalUsuarios}</div>
                    <div className="stat-label">Usuarios Totales</div>
                    <div className="stat-cambio">+12.4% ↑</div>
                  </div>
                  <div className="stat-grafico">📈</div>
                </div>

                <div className="tarjeta-stat azul">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.usuariosActivos}</div>
                    <div className="stat-label">Usuarios Activos</div>
                    <div className="stat-cambio">+40.9% ↑</div>
                  </div>
                  <div className="stat-grafico">👥</div>
                </div>

                <div className="tarjeta-stat naranja">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.administradores}</div>
                    <div className="stat-label">Administradores</div>
                    <div className="stat-cambio">+84.7% ↑</div>
                  </div>
                  <div className="stat-grafico">🛡️</div>
                </div>

                <div className="tarjeta-stat roja">
                  <div className="stat-contenido">
                    <div className="stat-numero">{estadisticas.nuevosHoy}</div>
                    <div className="stat-label">Nuevos Hoy</div>
                    <div className="stat-cambio">-23.6% ↓</div>
                  </div>
                  <div className="stat-grafico">📊</div>
                </div>
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
              <div className="seccion-header">
                <h2>Gestión de Usuarios</h2>
                {!readOnly && (
                  <button className="btn-primary" onClick={abrirModalCrear}>
                    ➕ Nuevo Usuario
                  </button>
                )}
              </div>
              <div className="busqueda-contenedor">
                <input
                  type="text"
                  placeholder="🔍 Buscar usuarios..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="input-busqueda"
                />
              </div>
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
            </div>

          )}
          {seccionActiva === "configuracion" && (
            <div className="seccion-configuracion">
              <h2>Configuración del Sistema</h2>
              <p>Próximamente: Configuraciones del sistema</p>
            </div>
          )}
          {seccionActiva === "solicitudes" && (
         
            <GestionSolicitud/>
          
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
      </div>
    </div>
  )
}
export default Dashboard