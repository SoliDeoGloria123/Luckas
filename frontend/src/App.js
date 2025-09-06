import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login.jsx';
import Registro from './components/signup/registro';
import DashboardAdmin from "./components/Dashboard/DashboardAdmin";
import DashboardTesorero from "./components/Tesorero/DashboardTesorero";
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
import ExternalDashboard from './pages/External/ExternalDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/external" element={<ExternalDashboard />} />
        <Route path="/external/login" element={<Login />} />
        <Route path="/external/dashboard" element={<ExternalDashboard />} />
        <Route path="/home" element={<div style={{width: '100%', height: '100vh'}}><iframe src="/Externo/templates/home.html" style={{width: '100%', height: '100%', border: 'none'}} /></div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/registro" element={<Registro />} />
        <Route path="/admin/users" element={<DashboardAdmin />} />
        <Route path="/tesorero" element={<DashboardTesorero />} />
        <Route path='/tesorero-Gestiones' element={<GestionTesorero/>}/>
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