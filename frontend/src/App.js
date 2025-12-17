import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Registro from './components/signup/registro';
import OlvidoPassw from './components/forget password/olvidarPassword';
import ExternalDashboard from './components/External/TailwindExternalDashboard';
import DashboardAdmin from "./components/Dashboard/DashboardAdmin";
import Dashboarduser from "./components/Dashboard/GestionUsuario";
import GestionAcategorizacion from "./components/Dashboard/GestionCategorizacion";
import GestionAprogramas from "./components/Dashboard/ProgramasAcademicos";
import GestionAeventos from "./components/Dashboard/GestionEventos";
import GestionAsolicitud from "./components/Dashboard/GestionSolicitud";
import GestionAinscripcion from "./components/Dashboard/GestionIscripcion";
import GestionCertificacion from "./components/Dashboard/GestionCertificacion";
import GestionAtareas from "./components/Dashboard/GestionTarea";
import GestionAcabanas from "./components/Dashboard/GestioCabañas";
import GestionAreservas from "./components/Dashboard/GestionReservas";
import GestionAreportes from "./components/Dashboard/Reportes";
import MiPerfil from "./components/Dashboard/Perfil";
import DashboardTesorero from "./components/Tesorero/DashboardTesorero";
import GestionTusuarios from "./components/Tesorero/Tablas/Gestionusuarios";
import GestionTcategorias from "./components/Tesorero/Tablas/Gestioncategorizar";
import GestionTsolicitudes from "./components/Tesorero/Tablas/Gestionsolicitud";
import GestionTeventos from "./components/Tesorero/Tablas/Gestionevento";
import GestionTcabanas from "./components/Tesorero/Tablas/Gestioncabana";
import GestionTprogramas from "./components/Tesorero/Tablas/Gestionprogramas";
import GestionTreservas from "./components/Tesorero/Tablas/Gestionreserva";
import GestionTtarea from "./components/Tesorero/Tablas/Gestiontareas";
import GestionTinscripcion from "./components/Tesorero/Tablas/Gestioninscripcion";
import GestionTcertificados from "./components/Tesorero/Tablas/Gestioncertificados";
import GestionTreportes from "./components/Tesorero/Tablas/Gestioreportes";
import GestionTesorero from './components/Tesorero/Gestion';
import GestionTperfil from './components/Tesorero/perfil';
import DashboardSeminarista from "./components/Seminarista/DashboardSeminarista";
import GestionTareasSeminarista from "./components/Seminarista/pages/GestionTareas";
import EventosNavegables from "./components/Seminarista/pages/EventosNavegables";
import CabanasNavegables from "./components/Seminarista/pages/CabanasNavegables";
import CursosNavegables from "./components/Seminarista/pages/CursosNavegables";
import MisInscripciones from "./components/Seminarista/pages/MisInscripciones";
import MisReservas from "./components/Seminarista/pages/MisReservas";
import MisSolicitudes from "./components/Seminarista/pages/MisSolicitudes";
import NuevaSolicitud from "./components/Seminarista/pages/NuevaSolicitud";
import Perfil from './components/Seminarista/Shared/MiPerfil';

import PanelPrincipal from './components/Panel Principal/Panel';
import CerrarSesion from './components/cerrar sesion/cerrarsesion';
import Error404 from './components/Páginas de error/Error404';
import Error403 from './components/Páginas de error/Error403';
import Error400 from './components/Páginas de error/Error400';
import Error500 from './components/Páginas de error/Error500';
import Error503 from './components/Páginas de error/Error503';

import Contactanos from './components/Pages/Contactanos';
import AyudaOnline from './components/Pages/AyudaOnline';
import PoliticaPrivacidad from './components/Pages/PoliticaPrivacidad';
import TerminosUso from './components/Pages/TerminosUso';
import SoporteTecnico from './components/Pages/SoporteTecnico';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';


// Componente para usuarios externos


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PanelPrincipal />} />
        <Route path="/external" element={<ExternalDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/registro" element={<Registro />} />
        <Route path="/Olvidar-Contraseña" element={<OlvidoPassw />} />
        {/* Rutas para Admin */}
        <Route path="/admin/Dashboard" element={<ProtectedRoute Component={DashboardAdmin} allowedRoles={['admin']} />} />
        <Route path="/admin/usuarios" element={<ProtectedRoute Component={Dashboarduser} allowedRoles={['admin']} />} />
        <Route path="/admin/categorizacion" element={<ProtectedRoute Component={GestionAcategorizacion} allowedRoles={['admin']} />} />
        <Route path="/admin/programas-academicos" element={<ProtectedRoute Component={GestionAprogramas} allowedRoles={['admin']} />} />
        <Route path="/admin/eventos" element={<ProtectedRoute Component={GestionAeventos} allowedRoles={['admin']} />} />
        <Route path="/admin/solicitudes" element={<ProtectedRoute Component={GestionAsolicitud} allowedRoles={['admin']} />} />
        <Route path="/admin/inscripciones" element={<ProtectedRoute Component={GestionAinscripcion} allowedRoles={['admin']} />} />
        <Route path="/admin/certificaciones" element={<ProtectedRoute Component={GestionCertificacion} allowedRoles={['admin']} />} />
        <Route path="/admin/tareas" element={<ProtectedRoute Component={GestionAtareas} allowedRoles={['admin']} />} />
        <Route path="/admin/cabanas" element={<ProtectedRoute Component={GestionAcabanas} allowedRoles={['admin']} />} />
        <Route path="/admin/reservas" element={<ProtectedRoute Component={GestionAreservas} allowedRoles={['admin']} />} />
        <Route path="/admin/reportes" element={<ProtectedRoute Component={GestionAreportes} allowedRoles={['admin']} />} />
        <Route path="/admin/perfil" element={<ProtectedRoute Component={MiPerfil} allowedRoles={['admin']} />} />
        {/* Rutas para Tesorero */}
        <Route path="/tesorero" element={<ProtectedRoute Component={DashboardTesorero} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/usuarios" element={<ProtectedRoute Component={GestionTusuarios} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/categorias" element={<ProtectedRoute Component={GestionTcategorias} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/solicitudes" element={<ProtectedRoute Component={GestionTsolicitudes} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/eventos" element={<ProtectedRoute Component={GestionTeventos} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/programas" element={<ProtectedRoute Component={GestionTprogramas} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/cabañas" element={<ProtectedRoute Component={GestionTcabanas} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/reservas" element={<ProtectedRoute Component={GestionTreservas} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/tarea" element={<ProtectedRoute Component={GestionTtarea} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/inscripcion" element={<ProtectedRoute Component={GestionTinscripcion} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/certificados" element={<ProtectedRoute Component={GestionTcertificados} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/reportes" element={<ProtectedRoute Component={GestionTreportes} allowedRoles={['tesorero']} />} />
        <Route path="/tesorero/perfil" element={<ProtectedRoute Component={GestionTperfil} allowedRoles={['tesorero']} />} />
        <Route path='/tesorero-Gestiones' element={<ProtectedRoute Component={GestionTesorero} allowedRoles={['tesorero']} />} />
        {/* Rutas para Seminarista */}
        <Route path="/seminarista" element={<ProtectedRoute Component={DashboardSeminarista} allowedRoles={['seminarista']} />} />
        <Route path="/seminarista/tareas" element={<ProtectedRoute Component={GestionTareasSeminarista} allowedRoles={['seminarista']} />} />
        <Route path="/dashboard/seminarista/eventos" element={<ProtectedRoute Component={EventosNavegables} allowedRoles={['seminarista']} />} />
        <Route path="/dashboard/seminarista/cabanas" element={<ProtectedRoute Component={CabanasNavegables} allowedRoles={['seminarista']} />} />
        <Route path="/dashboard/seminarista/cursos" element={<ProtectedRoute Component={CursosNavegables} allowedRoles={['seminarista']} />} />
        <Route path="/dashboard/seminarista/mis-inscripciones" element={<ProtectedRoute Component={MisInscripciones} allowedRoles={['seminarista']} />} />
        <Route path="/dashboard/seminarista/mis-reservas" element={<ProtectedRoute Component={MisReservas} allowedRoles={['seminarista']} />} />
        <Route path="/dashboard/seminarista/mis-solicitudes" element={<ProtectedRoute Component={MisSolicitudes} allowedRoles={['seminarista']} />} />
        <Route path="/dashboard/seminarista/nueva-solicitud" element={<ProtectedRoute Component={NuevaSolicitud} allowedRoles={['seminarista']} />} />
        <Route path="/dashboard/seminarista/Mi-Perfil" element={<ProtectedRoute Component={Perfil} allowedRoles={['seminarista']} />} />
        {/* Ruta para cerrar sesión */}
        <Route path="/cerrar-sesion" element={<CerrarSesion />} />
        {/* Rutas para páginas de error */}
        <Route path="/error403" element={<Error403 />} />
        <Route path="/error400" element={<Error400 />} />
        <Route path="/error500" element={<Error500 />} />
        <Route path="/error503" element={<Error503 />} />
        <Route path="*" element={<Error404 />} />

        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/ayuda" element={<AyudaOnline />} />
        <Route path="/politica" element={<PoliticaPrivacidad />} />
        <Route path="/terminos" element={<TerminosUso />} />
        <Route path="/soporte" element={<SoporteTecnico />} />
      </Routes>
    </Router>
  );
}

export default App;