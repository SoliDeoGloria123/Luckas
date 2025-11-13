import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Menu, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import NotificationButton from '../Shared/NotificationButton';



const Header = ({ sidebarAbierto, setSidebarAbierto, seccionActiva = "dashboard", onCerrarSesion: onCerrarSesionProp }) => {
  const { toggleTema, esTemaOscuro } = useTheme();
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [mostrarMenu, setMostrarMenu] = useState(false);
  // Fallback para evitar error si no se pasa la función
  const safeSetSidebarAbierto = typeof setSidebarAbierto === 'function' ? setSidebarAbierto : () => { };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarMenu(false);
      }
    };

    if (mostrarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarMenu]);

  // Obtener usuario logueado desde localStorage
  const usuarioLogueado = (() => {
    try {
      const usuarioStorage = localStorage.getItem('usuario');
      return usuarioStorage ? JSON.parse(usuarioStorage) : null;
    } catch {
      return null;
    }
  })();
  const handleCerrarSesion = () => {
    // Cerrar el menú desplegable primero
    setMostrarMenu(false);

    // Pequeño delay para permitir que la animación del menú termine
    setTimeout(() => {
      if (onCerrarSesionProp) {
        onCerrarSesionProp();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        globalThis.location.href = '/cerrar-sesion';
    
      }
    }, 100);
  };
  
  const perfil = () => {
    navigate('/admin/perfil');
  };

  return (
    <header
      className="glass-card border-b px-6 py-4 sticky top-0 z-20" style={{ borderColor: 'var(--border-color)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => safeSetSidebarAbierto(!sidebarAbierto)}
            className="p-2 rounded-xl transition-all duration-300 icon-bounce"
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)'
            }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm fade-in-up" style={{ color: 'var(--text-muted)' }}>
            Dashboard / {seccionActiva.charAt(0).toUpperCase() + seccionActiva.slice(1)}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search con efectos */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 glass-card border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          {/* Toggle de tema */}
          <button
            onClick={toggleTema}
            className="p-2 rounded-xl glass-card transition-all duration-300 icon-bounce"
            style={{ color: 'var(--text-secondary)' }}
            title={`Cambiar a modo ${esTemaOscuro ? 'claro' : 'oscuro'}`}
          >
            {esTemaOscuro ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications con sistema de notificaciones */}
          <NotificationButton 
            token={localStorage.getItem('token')} 
            userRole={usuarioLogueado?.role || ''} 
          />

          {/* User Menu Premium */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMostrarMenu(!mostrarMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl glass-card hover:shadow-lg transition-all duration-300"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shimmer">
                {usuarioLogueado && usuarioLogueado.nombre ? usuarioLogueado.nombre.charAt(0).toUpperCase() : ''}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-800">
                  {usuarioLogueado && usuarioLogueado.nombre ? usuarioLogueado.nombre : 'Usuario'}
                </p>
                <p className="text-xs text-slate-500">{usuarioLogueado && usuarioLogueado.role ? usuarioLogueado.role.charAt(0).toUpperCase() + usuarioLogueado.role.slice(1) : 'Administrador'}</p>
              </div>
            </button>

            {mostrarMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl shadow-xl border border-white/20 py-2 z-50 fade-in-up">
                <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-100/80 transition-colors">
                  Configuración
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-100/80 transition-colors" onClick={perfil}>
                  Perfil
                </button>
                <div className="border-t border-slate-200/50 my-1"></div>
                <button onClick={handleCerrarSesion}

                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
};

Header.propTypes = {
  sidebarAbierto: PropTypes.bool.isRequired,
  setSidebarAbierto: PropTypes.func.isRequired,
  seccionActiva: PropTypes.string,
  onCerrarSesion: PropTypes.func
};

export default Header;
