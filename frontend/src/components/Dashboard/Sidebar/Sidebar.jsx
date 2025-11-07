import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Users,
    Settings,
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
                { id: "dashboard", icon: Activity, label: "Dashboard", color: "text-blue-500" },
                { id: "usuarios", icon: Users, label: "Usuarios", color: "text-purple-500" },
                { id: "configuracion", icon: Settings, label: "Configuración", color: "text-gray-500" },
            ]
        },
        {
            section: "GESTIÓN ACADÉMICA",
            items: [
                { id: "categorizacion", icon: Layers, label: "Categorización", color: "text-emerald-500" },
                { id: "programas-academicos", icon: GraduationCap, label: "Programas Académicos", color: "text-blue-600" },
                { id: "eventos", icon: CalendarIcon, label: "Eventos", color: "text-amber-500" },
            ]
        },
        {
            section: "ADMINISTRACIÓN",
            items: [
                { id: "solicitudes", icon: Mail, label: "Solicitudes", color: "text-rose-500" },
                { id: "inscripciones", icon: UserPlus, label: "Inscripciones", color: "text-cyan-500" },
                { id: "certificaciones", icon: GraduationCap, label: "Certificaciones", color: "text-yellow-500" },
                { id: "tareas", icon: CheckSquare, label: "Tareas", color: "text-green-500" },
            ]
        },
        {
            section: "SERVICIOS",
            items: [
                { id: "cabanas", icon: Home, label: "Cabañas", color: "text-orange-500" },
                { id: "reservas", icon: Calendar, label: "Reservas", color: "text-teal-500" },
                { id: "reportes", icon: BarChart3, label: "Reportes", color: "text-pink-500" },
            ]
        }
    ];
    return (
        <>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
            {/* Sidebar Premium con animaciones */}
            <div className={`fixed left-0 top-0 h-full glass-card border-r shadow-2xl transition-all duration-300 z-30 ${sidebarAbierto ? 'w-72' : 'w-20'}`}>
                {/* Logo con efecto shimmer */}
                < div className="p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shimmer">
                            <BookOpen className="w-6 h-6 text-white icon-bounce" />
                        </div>
                        {sidebarAbierto && (
                            <div className="fade-in-up ">
                                <h1 className="luckas" >LUCKAS</h1>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Admin Panel</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation con efectos premium */}
                < nav className="p-4 space-y-6" >
                    {
                        menuItems.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="fade-in-up" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
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
                                                        if (["dashboard", "usuarios", "categorizacion", "programas-academicos", "solicitudes", "inscripciones", "certificaciones", "tareas", "cabanas", "reservas", "reportes", "eventos"].includes(item.id)) {
                                                            navigate(`/admin/${item.id}`);
                                                        }
                                                        setSeccionActiva(item.id);
                                                    }}
                                                    className={`sidebar-item w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                                        ? `active text-white shadow-lg ${item.color}`
                                                        : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/80'
                                                        }`}
                                                    style={{
                                                        color: isActive ? 'white' : 'var(--text-secondary)'
                                                    }}
                                                >
                                                    <Icon className={`w-5 h-5 icon-bounce ${isActive ? 'text-white' : item.color}`} />
                                                    {sidebarAbierto && (
                                                        <span className="font-medium">{item.label}</span>
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
