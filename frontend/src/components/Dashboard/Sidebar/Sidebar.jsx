import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Users,
    BarChart3,
    Calendar,
    Home,
    GraduationCap,
    UserPlus,
    Mail,
    CheckSquare,
    Activity,
    BookOpen,
    Layers,
    Calendar as CalendarIcon,
} from 'lucide-react';

import PropTypes from "prop-types";

const Sidebar = ({ sidebarAbierto, setSidebarAbierto, seccionActiva, setSeccionActiva }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determinar la sección activa según la ruta actual
    const getActiveSection = () => {
        const path = location.pathname;
        // Extraer el id de la ruta: /admin/usuarios => usuarios
        const match = path.match(/^\/admin\/([^/]+)/);
        if (match) return match[1];
        return seccionActiva;
    };
    const activeSection = getActiveSection();

    const menuItems = [
        {
            section: "PRINCIPAL",
            items: [
                { id: "dashboard", icon: Activity, label: "Dashboard", color: "text-blue-500", bg: "bg-blue-50", iconColor: "text-blue-600" },
                { id: "usuarios", icon: Users, label: "Usuarios", color: "text-purple-500", bg: "bg-purple-50", iconColor: "text-purple-600" }
            ]
        },
        {
            section: "GESTIÓN ACADÉMICA",
            items: [
                { id: "categorizacion", icon: Layers, label: "Categorización", color: "text-emerald-500", bg: "bg-emerald-50", iconColor: "text-emerald-600" },
                { id: "programas-academicos", icon: GraduationCap, label: "Programas Académicos", color: "text-blue-600", bg: "bg-blue-50", iconColor: "text-blue-700" },
                { id: "eventos", icon: CalendarIcon, label: "Eventos", color: "text-amber-500", bg: "bg-amber-50", iconColor: "text-amber-600" },
            ]
        },
        {
            section: "ADMINISTRACIÓN",
            items: [
                { id: "solicitudes", icon: Mail, label: "Solicitudes", color: "text-rose-500", bg: "bg-rose-50", iconColor: "text-rose-600" },
                { id: "inscripciones", icon: UserPlus, label: "Inscripciones", color: "text-cyan-500", bg: "bg-cyan-50", iconColor: "text-cyan-600" },
                { id: "certificaciones", icon: GraduationCap, label: "Certificaciones", color: "text-yellow-500", bg: "bg-yellow-50", iconColor: "text-yellow-600" },
                { id: "tareas", icon: CheckSquare, label: "Tareas", color: "text-green-500", bg: "bg-green-50", iconColor: "text-green-600" },
            ]
        },
        {
            section: "SERVICIOS",
            items: [
                { id: "cabanas", icon: Home, label: "Cabañas", color: "text-orange-500", bg: "bg-orange-50", iconColor: "text-orange-600" },
                { id: "reservas", icon: Calendar, label: "Reservas", color: "text-teal-500", bg: "bg-teal-50", iconColor: "text-teal-600" },
                { id: "reportes", icon: BarChart3, label: "Reportes", color: "text-pink-500", bg: "bg-pink-50", iconColor: "text-pink-600" },
            ]
        }
    ];
    // Mapa explícito de rutas para evitar inconsistencias de mayúsculas u otras diferencias
    const routeMap = {
        dashboard: '/admin/Dashboard', // coincide con App.js
        usuarios: '/admin/usuarios',
        categorizacion: '/admin/categorizacion',
        'programas-academicos': '/admin/programas-academicos',
        eventos: '/admin/eventos',
        solicitudes: '/admin/solicitudes',
        inscripciones: '/admin/inscripciones',
        certificaciones: '/admin/certificaciones',
        tareas: '/admin/tareas',
        cabanas: '/admin/cabanas',
        reservas: '/admin/reservas',
        reportes: '/admin/reportes'
    };
    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
            {/* Sidebar Premium con animaciones */}
            <div className={`fixed left-0 top-0 h-full glass-card border-r shadow-2xl transition-all duration-300 z-30 ${sidebarAbierto ? 'w-72' : 'w-16'}`}>
                {/* Logo con efecto shimmer */}
                < div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shimmer">
                            <BookOpen className="w-6 h-6 text-white icon-bounce" />
                        </div>
                        {sidebarAbierto ? (
                            <div className="fade-in-up ">
                                <h1 className="luckas" >LUCKAS</h1>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Admin Panel</p>
                            </div>
                        ) : (
                            <div className="ml-0 pl-0" />
                        )}
                    </div>
                </div>

                {/* Navigation con efectos premium */}
                < nav className="p-4 space-y-6" >
                    {
                menuItems.map((section, sectionIndex) => (
                    <div key={section.section} className="fade-in-up" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
                                {sidebarAbierto && (
                                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                                        {section.section}
                                    </h3>
                                )}
                                <ul className="space-y-1">
                                    {section.items.map((item, itemIndex) => {
                                        const Icon = item.icon;
                                        const isActive = activeSection === item.id;
                                        return (
                                            <li key={item.id} style={{ animationDelay: `${(sectionIndex * 4 + itemIndex) * 0.05}s` }}>
                                                <button
                                                    onClick={() => {
                                                        const route = routeMap[item.id] || `/admin/${item.id}`;
                                                        if (typeof route === 'string' && route.length) {
                                                            navigate(route);
                                                        } else {
                                                            navigate('/admin/Dashboard');
                                                        }
                                                        setSeccionActiva(item.id);
                                                        // Mantener la barra colapsada después de seleccionar
                                                        if (!sidebarAbierto) {
                                                            setSidebarAbierto(false);
                                                        }
                                                    }}
                                                    className={`sidebar-item w-full ${sidebarAbierto ? 'flex items-center space-x-3 px-3 py-3 rounded-xl' : 'flex items-center justify-center p-2 rounded-md'} transition-all duration-200 group ${isActive
                                                        ? `active text-white shadow-lg ${item.color}`
                                                        : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/80'
                                                        }`}
                                                    style={{
                                                        color: isActive ? 'white' : 'var(--text-secondary)'
                                                    }}
                                                    title={item.label}
                                                >
                                                    {/* Icono: en modo colapsado aparece dentro de un círculo con fondo */}
                                                    {sidebarAbierto ? (
                                                        <>
                                                            <Icon className={`w-5 h-5 icon-bounce ${isActive ? 'text-white' : item.color}`} />
                                                            <span className="font-medium">{item.label}</span>
                                                        </>
                                                    ) : (
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bg}`}>
                                                            <Icon className={`w-5 h-5 ${item.iconColor}`} />
                                                        </div>
                                                    )}
                                                    {isActive && sidebarAbierto && (
                                                        <div className="ml-auto w-2 h-2 bg-white rounded-full pulse-notification"></div>
                                                    )}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))
                    }
                </nav >
            </div >
        </>
    )
};

Sidebar.propTypes = {
    sidebarAbierto: PropTypes.bool.isRequired,
    setSidebarAbierto: PropTypes.func.isRequired,
    seccionActiva: PropTypes.string.isRequired,
    setSeccionActiva: PropTypes.func.isRequired,
};

export default Sidebar;
