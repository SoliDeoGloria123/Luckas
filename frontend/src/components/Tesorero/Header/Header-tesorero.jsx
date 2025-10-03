import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import './header.css'
import { Search, Bell, ChevronDown } from "lucide-react";


const HeaderTesorero = () => {
    const [openmenu, setOpenMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false)
    const [usuario, setUsuario] = useState({});
    const [seccionActiva, setSeccionActiva] = useState("gestion");

    // Obtener usuario logueado desde localStorage
    const usuarioLogueado = (() => {
        try {
            const usuarioStorage = localStorage.getItem('usuario');
            return usuarioStorage ? JSON.parse(usuarioStorage) : null;
        } catch {
            return null;
        }
    })();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/";
    };
    // Función para cambiar la sección activa
    const handleGestionar = (seccion) => {
        setSeccionActiva(seccion);
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
                        <a href="/tesorero" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                            Dashboard
                        </a>
                        <a href="/tesorero-Gestiones" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                            Gestiones
                        </a>
                        <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                            Finanzas
                        </a>
                        <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                            Reportes
                        </a>
                    </nav>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
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
                    <button className="relative rounded-lg p-2 hover:bg-gray-100 transition-colors">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>

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
                                <a href="/tesorero/configuracion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Configuración
                                </a>
                                <hr className="my-1" />
                                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50" onClick={handleLogout}>
                                    Cerrar Sesión
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );

};

export default HeaderTesorero