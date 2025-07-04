import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Registro from './components/signup/registro';
import DashboardAdmin from "./components/Dashboard/DashboardAdmin";
import DashboardTesorero from "./components/Dashboard/DashboardTesorero";
import DashboardSeminarista from "./components/Dashboard/DashboardSeminarista";

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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/external" element={<ExternalHome />} />
        <Route path="/home" element={<div style={{width: '100%', height: '100vh'}}><iframe src="/Externo/templates/home.html" style={{width: '100%', height: '100%', border: 'none'}} /></div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/registro" element={<Registro />} />
        <Route path="/admin/users" element={<DashboardAdmin />} />
        <Route path="/tesorero/dashboard" element={<DashboardTesorero />} />
        <Route path="/seminarista/dashboard" element={<DashboardSeminarista />} />
      </Routes>
    </Router>
  );
}

export default App;