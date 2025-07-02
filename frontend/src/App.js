import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Registro from './components/signup/registro';
import DashboardAdmin from "./components/Dashboard/DashboardAdmin";
import DashboardTesorero from "./components/Dashboard/DashboardTesorero";
import DashboardSeminarista from "./components/Dashboard/DashboardSeminarista";
import DashboardExterno from "./components/Dashboard/DashboardExterno";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/registro" element={<Registro />} />
        <Route path="/admin/users" element={<DashboardAdmin />} />
        <Route path="/tesorero/dashboard" element={<DashboardTesorero />} />
        <Route path="/seminarista/dashboard" element={<DashboardSeminarista />} />
        <Route path="/externo/dashboard" element={<DashboardExterno />} />
      </Routes>
    </Router>
  );
}

export default App;