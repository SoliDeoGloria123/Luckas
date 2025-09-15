import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from './components/Panel Principal/Panel'
import Login from './components/Login/Login';
import Registro from './components/signup/registro';
import OlvidoPassw from './components/forget password/olvidarPassword';
import DashboardAdmin from "./components/Dashboard/DashboardAdmin";
import Dashboarduser from "./components/Dashboard/GestionUsuario";
import GestionAcategorizacion from "./components/Dashboard/GestionCategorizacion";
import GestionAprogramas from "./components/Dashboard/ProgramasAcademicos";
import GestionAcursos from "./components/Dashboard/Cursos";
import GestionAeventos from "./components/Dashboard/GestionEventos";
import GestionAsolicitud from "./components/Dashboard/GestionSolicitud";
import GestionAinscripcion from "./components/Dashboard/GestionIscripcion";
import GestionAtareas from "./components/Dashboard/GestionTarea";
import GestionAcabanas from "./components/Dashboard/GestioCabañas";
import GestionAreservas from "./components/Dashboard/GestionReservas";
import GestionAreportes from "./components/Dashboard/Reportes";
import DashboardTesorero from "./components/Tesorero/DashboardTesorero";
import GestionTusuarios from "./components/Tesorero/Tablas/Gestionusuarios";
import GestionTcategorias from "./components/Tesorero/Tablas/Gestioncategorizar";
import GestionTsolicitudes from "./components/Tesorero/Tablas/Gestionsolicitud";
import GestionTeventos from "./components/Tesorero/Tablas/Gestionevento";
import GestionTcabanas from "./components/Tesorero/Tablas/Gestioncabana";
import GestionTreservas from "./components/Tesorero/Tablas/Gestionreserva";
//import GestionTcursos from "./components/Tesorero/Tablas/Gestioncurso";
import GestionTtarea from "./components/Tesorero/Tablas/Gestiontareas";
import GestionTinscripcion from "./components/Tesorero/Tablas/Gestioninscripcion";
import GestionTreportes from "./components/Tesorero/Tablas/Gestioreportes";
import GestionTesorero from './components/Tesorero/Gestion';
import DashboardSeminarista from "./components/Seminarista/DashboardSeminarista";
import EventosNavegables from "./components/Seminarista/pages/EventosNavegables";
import CabanasNavegables from "./components/Seminarista/pages/CabanasNavegables";
import MisInscripciones from "./components/Seminarista/pages/MisInscripciones";
import MisReservas from "./components/Seminarista/pages/MisReservas";
import MisSolicitudes from "./components/Seminarista/pages/MisSolicitudes";
import NuevaSolicitud from "./components/Seminarista/pages/NuevaSolicitud";
import Perfil from './components/Seminarista/Shared/MiPerfil';
import Configuracion from './components/Seminarista/pages/configuracion';


// Componente para usuarios externos
const ExternalHome = () => {
  return (
    <div style={{width: '100%', height: '100vh'}}>
      <iframe 
        src="http://localhost:3000" 
        style={{width: '100%', height: '100%', border: 'none'}} 
        title="Página Externa"
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index to="/index" replace />} />
        <Route path="/external" element={<ExternalHome />} />
        <Route path="/home" element={<div style={{width: '100%', height: '100vh'}}><iframe src="/Externo/templates/home.html" style={{width: '100%', height: '100%', border: 'none'}} /></div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/registro" element={<Registro />}/>
        <Route path="/Olvidar-Contraseña" element={<OlvidoPassw />}/>
        {/* Rutas para Admin */}
        <Route path="/admin/Dashboard" element={<DashboardAdmin />}/>
        <Route path="/admin/usuarios" element={<Dashboarduser />}/>
        <Route path="/admin/categorizacion" element={<GestionAcategorizacion />}/>
        <Route path="/admin/programas-academicos" element={<GestionAprogramas />}/>
        <Route path="/admin/cursos" element={<GestionAcursos />}/>
        <Route path="/admin/eventos" element={<GestionAeventos />}/>
        <Route path="/admin/solicitudes" element={<GestionAsolicitud />}/>
        <Route path="/admin/inscripcion" element={<GestionAinscripcion />}/>
        <Route path="/admin/tareas" element={<GestionAtareas />}/>
        <Route path="/admin/cabanas" element={<GestionAcabanas />}/>
        <Route path="/admin/reservas" element={<GestionAreservas />}/>
        <Route path="/admin/reportes" element={<GestionAreportes />}/>
        {/* Rutas para Tesorero */}
        <Route path="/tesorero" element={<DashboardTesorero />}/>
        <Route path="/tesorero/usuarios" element={<GestionTusuarios />}/>
        <Route path="/tesorero/categorias" element={<GestionTcategorias />}/>
        <Route path="/tesorero/solicitudes" element={<GestionTsolicitudes />}/>
        <Route path="/tesorero/eventos" element={<GestionTeventos/>}/>
        <Route path="/tesorero/cabañas" element={<GestionTcabanas/>}/>
        <Route path="/tesorero/reservas" element={<GestionTreservas/>}/>
        {/*<Route path="/tesorero/cursos" element={<GestionTcursos/>}/>*/}
        <Route path="/tesorero/tarea" element={<GestionTtarea/>}/>
        <Route path="/tesorero/inscripcion" element={<GestionTinscripcion/>}/>
        <Route path="/tesorero/reportes" element={<GestionTreportes/>}/>
        <Route path='/tesorero-Gestiones' element={<GestionTesorero/>}/>
        {/* Rutas para Seminarista */}
        <Route path="/seminarista" element={<DashboardSeminarista />} />
        <Route path="/dashboard/seminarista/eventos" element={<EventosNavegables />} />
        <Route path="/dashboard/seminarista/cabanas" element={<CabanasNavegables />} />
        <Route path="/dashboard/seminarista/mis-inscripciones" element={<MisInscripciones />} />
        <Route path="/dashboard/seminarista/mis-reservas" element={<MisReservas />} />
        <Route path="/dashboard/seminarista/mis-solicitudes" element={<MisSolicitudes />} />
        <Route path="/dashboard/seminarista/nueva-solicitud" element={<NuevaSolicitud />} />
        <Route path="/dashboard/seminarista/Mi-Perfil" element={<Perfil />} />
        <Route path="/dashboard/seminarista/Configuracion" element={<Configuracion />} />
      </Routes>
    </Router>
  );
}

export default App;