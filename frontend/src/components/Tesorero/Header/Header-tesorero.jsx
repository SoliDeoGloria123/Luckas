import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './header.css'
import { Search, ChevronDown, Menu } from "lucide-react";
import NotificationButton from '../../notificaciones/admin-tesorero/NotificationButton';


const HeaderTesorero = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(false);
    // Obtener usuario logueado desde localStorage
    const usuarioLogueado = (() => {
        try {
            const usuarioStorage = localStorage.getItem('usuario');
            return usuarioStorage ? JSON.parse(usuarioStorage) : null;
        } catch {
            return null;
        }
    })();

    // Funciones de navegación
    const handleDashboardClick = () => navigate('/tesorero');
    const handleGestionesClick = () => navigate('/tesorero-Gestiones');
    const handleReportesClick = () => navigate('/tesorero/reportes');

    // Obtener token del usuario logueado
    const token = localStorage.getItem('token');


    // Función para determinar si un botón está activo
    const isActive = (path) => {
        if (path === '/tesorero') {
            return location.pathname === '/tesorero';
        }
        if (path === '/tesorero-Gestiones') {
            return location.pathname === '/tesorero-Gestiones';
        }
        if (path === '/tesorero/reportes') {
            return location.pathname === '/tesorero/reportes' || location.pathname.includes('/tesorero/reportes');
        }
        return false;
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        globalThis.location.href = '/cerrar-sesion';
    };



    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
            <header className="header-tesorero-header sticky top-0 z-50">
                <div className="header-content-tesorero-header">
                    {/* Logo Section */}
                    <div className="logo-section-tesorero">
                        <div className="logo-text">
                            <span className="luckas-tesorero">Luckas</span>
                            <p className="text-xs text-blue-500">Panel del Tesorero</p>
                        </div>
                    </div>

                    {/* Navigation - Hidden on mobile, shown on medium+ screens */}
                    <nav className="main-nav-tesorero hidden md:flex">
                        <button
                            onClick={handleDashboardClick}
                            className={`nav-item-tesorero ${isActive('/tesorero') ? 'active' : ''}`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={handleGestionesClick}
                            className={`nav-item-tesorero ${isActive('/tesorero-Gestiones') ? 'active' : ''}`}
                        >
                            Gestiones
                        </button>
                        <button
                            onClick={handleReportesClick}
                            className={`nav-item-tesorero ${isActive('/tesorero/reportes') ? 'active' : ''}`}
                        >
                            Reportes
                        </button>
                    </nav>

                    {/* Right Section */}
                    <div className="header-actions-tesorero">
                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setShowMobileNav((s) => !s)}
                            aria-label="Abrir menú móvil"
                        >
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Search Bar - Hidden on mobile, shown on large+ screens */}
                        <div className="search-container-tesorero hidden lg:block">
                            <Search className="search-icon-tesorero h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="search-input-tesorero"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="notificacion-tesorero">
                            <NotificationButton
                                token={token}
                                userRole={usuarioLogueado?.role || ''}
                            />
                        </div>

                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="user-profile-tesorero"
                            >
                                <div className="user-avatar">
                                    {usuarioLogueado && usuarioLogueado.nombre ? usuarioLogueado.nombre.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="user-info-tesorero hidden sm:block">
                                    <p className="user-name-tesorero">{usuarioLogueado && usuarioLogueado.nombre ? usuarioLogueado.nombre : 'Usuario'}</p>
                                    <p className="user-role-tesorero">{usuarioLogueado?.role || "Rol"}</p>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
                            </button>

                            {showDropdown && (
                                <div className="dropdown-menu-tesorero">
                                    <a href="/tesorero/perfil">
                                        Mi Perfil
                                    </a>
                                    <hr className="my-1" />
                                    <button type="button" onClick={handleLogout} style={{color: '#ef4444'}}>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Mobile nav dropdown (aparece en pantallas pequeñas) */}
            {showMobileNav && (
                <nav className="mobile-nav md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 flex flex-col gap-2">
                        <button onClick={() => { setShowMobileNav(false); handleDashboardClick(); }} className={`text-left px-3 py-2 rounded ${isActive('/tesorero') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Dashboard</button>
                        <button onClick={() => { setShowMobileNav(false); handleGestionesClick(); }} className={`text-left px-3 py-2 rounded ${isActive('/tesorero-Gestiones') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Gestiones</button>
                        <button onClick={() => { setShowMobileNav(false); handleReportesClick(); }} className={`text-left px-3 py-2 rounded ${isActive('/tesorero/reportes') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Reportes</button>
                        
                        {/* Search on mobile */}
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>
                    </div>
                </nav>
            )}
        </>
    );

};

export default HeaderTesorero