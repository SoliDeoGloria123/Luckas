import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public components
import Home from './pages/Home';
import CursosHome from './pages/CursosHome';
import InscripcionHome from './pages/InscripcionHome';
import Login from './pages/Login';

// Private components
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Perfil from './pages/Perfil';
import Notificaciones from './pages/Notificaciones';
import Eventos from './pages/Eventos';
import Inscripcion from './pages/Inscripcion';
import ProgramasAcademicos from './pages/ProgramasAcademicos';
import Cabanas from './pages/Cabanas';

// Component to protect private routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Component to redirect authenticated users away from login
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cursos" element={<CursosHome />} />
      <Route path="/inscripcion-info" element={<InscripcionHome />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      {/* Private Routes - wrapped with Layout */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/perfil" 
        element={
          <PrivateRoute>
            <Layout>
              <Perfil />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/notificaciones" 
        element={
          <PrivateRoute>
            <Layout>
              <Notificaciones />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/eventos" 
        element={
          <PrivateRoute>
            <Layout>
              <Eventos />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/inscripcion" 
        element={
          <PrivateRoute>
            <Layout>
              <Inscripcion />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/programas-academicos" 
        element={
          <PrivateRoute>
            <Layout>
              <ProgramasAcademicos />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/cabanas" 
        element={
          <PrivateRoute>
            <Layout>
              <Cabanas />
            </Layout>
          </PrivateRoute>
        } 
      />
      
      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;