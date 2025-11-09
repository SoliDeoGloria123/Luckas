import { useState, useEffect, useCallback } from 'react';
import { userService } from '../../../services/userService';

// Hook personalizado para el manejo optimizado del dashboard admin
export const useDashboardAdmin = (usuarioProp, onCerrarSesion) => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    administradores: 0,
    nuevosHoy: 0,
  });
  const [usuarioActual, setUsuarioActual] = useState(usuarioProp);

  // Memoized function para evitar re-renders innecesarios
  const calcularEstadisticas = useCallback((usuariosData) => {
    const hoy = new Date().toDateString();
    setEstadisticas({
      totalUsuarios: usuariosData.length,
      usuariosActivos: usuariosData.filter((user) => user.status === "active").length,
      administradores: usuariosData.filter((user) => user.role === "admin").length,
      nuevosHoy: usuariosData.filter((user) => new Date(user.createdAt).toDateString() === hoy).length,
    });
  }, []);

  const handleCerrarSesion = useCallback(() => {
    if (onCerrarSesion) {
      onCerrarSesion();
    } else {
      localStorage.removeItem('token'); 
      localStorage.removeItem('usuario');
      globalThis.location.href = '/login';
    }
  }, [onCerrarSesion]);

  const obtenerUsuarios = useCallback(async () => {
    try {
      setCargando(true);
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
  }, [calcularEstadisticas, handleCerrarSesion]);

  // Efecto para cargar usuario desde localStorage
  useEffect(() => {
    if (!usuarioProp) {
      const usuarioStorage = localStorage.getItem('usuario');
      if (usuarioStorage) {
        setUsuarioActual(JSON.parse(usuarioStorage));
      }
    }
  }, [usuarioProp]);

  // Efecto para cargar usuarios al montar el componente
  useEffect(() => {
    obtenerUsuarios();
  }, [obtenerUsuarios]);

  return {
    usuarios,
    cargando,
    estadisticas,
    usuarioActual,
    setUsuarioActual,
    obtenerUsuarios,
    handleCerrarSesion,
    setUsuarios
  };
};
