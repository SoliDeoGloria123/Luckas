import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './header.css'
import { Search, ChevronDown, Menu } from "lucide-react";
import NotificationButton from '../../Dashboard/Shared/NotificationButton';


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
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6">
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
                <div className="flex items-center gap-12">
                    <div className="logo-text">
                        <span className="luckas-tesorero">Luckas</span>
                        <p className="text-xs text-blue-500">Panel del Tesorero</p>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button
                            onClick={handleDashboardClick}
                            className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive('/tesorero') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600'
                                }`}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={handleGestionesClick}
                            className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive('/tesorero-Gestiones') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600'
                                }`}
                        >
                            Gestiones
                        </button>

                        <button
                            onClick={handleReportesClick}
                            className={`text-sm font-medium hover:text-blue-600 transition-colors ${isActive('/tesorero/reportes') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-600'
                                }`}
                        >
                            Reportes
                        </button>
                    </nav>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setShowMobileNav((s) => !s)}
                        aria-label="Abrir menú móvil"
                    >
                        <Menu className="w-5 h-5 text-gray-600" />
                    </button>
                    {/* Search Bar */}
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="h-10 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {/* Notifications */}

                    <NotificationButton
                        token={token}
                        userRole={usuarioLogueado?.role || ''}
                    />


                    {/* User Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
                                {usuarioLogueado && usuarioLogueado.nombre ? usuarioLogueado.nombre.charAt(0).toUpperCase() : ''}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900">{usuarioLogueado && usuarioLogueado.nombre ? usuarioLogueado.nombre : 'Usuario'}</p>
                                <p className="text-xs text-gray-500">{usuarioLogueado?.role || "Rol"}</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                                <a href="/tesorero/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Mi Perfil
                                </a>
                        
                                <hr className="my-1" />
                                <button type="button" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50" onClick={handleLogout}>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Mobile nav dropdown (aparece en pantallas pequeñas) */}
            {showMobileNav && (
                <nav className="mobile-nav md:hidden border-t border-gray-200 bg-white">
                    <div className="px-4 py-3 flex flex-col gap-2">
                        <button onClick={() => { setShowMobileNav(false); handleDashboardClick(); }} className={`text-left px-3 py-2 rounded ${isActive('/tesorero') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Dashboard</button>
                        <button onClick={() => { setShowMobileNav(false); handleGestionesClick(); }} className={`text-left px-3 py-2 rounded ${isActive('/tesorero-Gestiones') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Gestiones</button>
                        <button onClick={() => { setShowMobileNav(false); handleReportesClick(); }} className={`text-left px-3 py-2 rounded ${isActive('/tesorero/reportes') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Reportes</button>
                    </div>
                </nav>
            )}
        </header>
    );

};

export default HeaderTesorero