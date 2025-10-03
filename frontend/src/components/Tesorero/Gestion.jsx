import React, { useState } from "react";
import { userService } from '../../services/userService';
import { categorizacionService } from '../../services/categorizacionService';
import { solicitudService } from '../../services/solicirudService';
import { eventService } from '../../services/eventService';
import { cabanaService } from '../../services/cabanaService';
import { reservaService } from '../../services/reservaService';
import { cursosService } from '../../services/cursosService';
import { tareaService } from '../../services/tareaService';
import { inscripcionService } from '../../services/inscripcionService';
import { reporteService } from '../../services/reporteService';
import HeaderTesorero from "./Header/Header-tesorero";
import Footer from '../footer/Footer';
import './Gestion.css';
// Importa los componentes de gestión
import Gestionusuarios from './Tablas/Gestionusuarios';
import Gestionsolicitud from './Tablas/Gestionsolicitud';
import Gestionevento from './Tablas/Gestionevento';
import Gestioncabana from './Tablas/Gestioncabana';
import Gestioninscripcion from './Tablas/Gestioninscripcion';
import Gestiontarea from './Tablas/Gestiontareas';
import Gestioncategorizacion from './Tablas/Gestioncategorizar';
import Gestionreporte from './Tablas/Gestioreportes';

const Gestion = ({ }) => {
    const [seccionActiva, setSeccionActiva] = useState("gestion");
            // Estados para los conteos
            const [stats, setStats] = useState({
                usuarios: 0,
                categorias: 0,
                solicitudes: 0,
                eventos: 0,
                cabanas: 0,
                reservas: 0,
                cursos: 0,
                tareas: 0,
                inscripciones: 0,
                reportes: 0
            });

            React.useEffect(() => {
                // Usuarios
                userService.getAllUsers().then(res => setStats(s => ({ ...s, usuarios: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
                // Categorías
                categorizacionService.getAll().then(res => setStats(s => ({ ...s, categorias: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
                // Solicitudes
                solicitudService.getAll().then(res => setStats(s => ({ ...s, solicitudes: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
                // Eventos
                eventService.getAllEvents().then(res => setStats(s => ({ ...s, eventos: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
                // Cabañas
                cabanaService.getAll().then(res => setStats(s => ({ ...s, cabanas: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
                // Reservas
                reservaService.getAll().then(res => setStats(s => ({ ...s, reservas: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
                // Cursos
                cursosService.obtenerCursos().then(res => setStats(s => ({ ...s, cursos: Array.isArray(res) ? res.length : 0 }))).catch(()=>{});
                // Tareas
                tareaService.getAll().then(res => setStats(s => ({ ...s, tareas: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
                // Inscripciones
                inscripcionService.getAll().then(res => setStats(s => ({ ...s, inscripciones: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
                // Reportes
                reporteService.getDashboard().then(res => setStats(s => ({ ...s, reportes: Array.isArray(res.data) ? res.data.length : 0 }))).catch(()=>{});
            }, []);

    // Función para cambiar la sección activa
    const handleGestionar = (seccion) => {
        setSeccionActiva(seccion);
    };

    return (
        <>
            <HeaderTesorero/>
            <main className="main-content-gestion">
                <div className="page-header-gestion">
                    <h1 className="page-title-gestion">Gestiones Administrativas</h1>
                    <p className="page-subtitle-gestion">Administra todos los recursos del sistema</p>
                </div>

                <div className="management-grid">
                    <div className="management-card" data-module="usuarios">
                        <div className="card-icon users">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="card-content">
                            <div className="card-stats">
                                <span className="stat-number">{stats.usuarios}</span>
                                <span className="stat-label">usuarios</span>
                                <span className="stat-change positive">+12 este mes</span>
                            </div>
                            <h3 className="card-title">Gestionar Usuarios</h3>
                            <p className="card-description">Administrar cuentas de usuarios del sistema</p>
                            <a href="#" className="card-action" onClick={e => { e.preventDefault(); handleGestionar("tesorero-usuarios"); }}>
                                Gestionar <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                    <div className="management-card" data-module="solicitudes">
                        <div className="card-icon requests">
                            <i className="fas fa-file-alt"></i>
                        </div>
                        <div className="card-content">
                            <div className="card-stats">
                                <span className="stat-number">{stats.solicitudes}</span>
                                <span className="stat-label">pendientes</span>
                                <span className="stat-change neutral">5 nuevas hoy</span>
                            </div>
                            <h3 className="card-title">Gestionar Solicitudes</h3>
                            <p className="card-description">Revisar y categorizar solicitudes</p>
                            <a href="#" className="card-action">
                                Gestionar <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>


                    <div className="management-card" data-module="eventos">
                        <div className="card-icon events">
                            <i className="fas fa-calendar-alt"></i>
                        </div>
                        <div className="card-content">
                            <div className="card-stats">
                                <span className="stat-number">{stats.eventos}</span>
                                <span className="stat-label">próximos</span>
                                <span className="stat-change neutral">2 esta semana</span>
                            </div>
                            <h3 className="card-title">Gestionar Eventos</h3>
                            <p className="card-description">Organizar y categorizar eventos</p>
                            <a href="#" className="card-action">
                                Gestionar <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>


                    <div className="management-card" data-module="cabanas">
                        <div className="card-icon cabins">
                            <i className="fas fa-home"></i>
                        </div>
                        <div className="card-content">
                            <div className="card-stats">
                                <span className="stat-number">{stats.cabanas}</span>
                                <span className="stat-label">disponibles</span>
                                <span className="stat-change positive">85% ocupación</span>
                            </div>
                            <h3 className="card-title">Gestionar Cabañas</h3>
                            <p className="card-description">Administrar reservas de cabañas</p>
                            <a href="#" className="card-action">
                                Gestionar <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>

                    <div className="management-card" data-module="cursos">
                        <div className="card-icon courses">
                            <i className="fas fa-book"></i>
                        </div>
                        <div className="card-content">
                            <div className="card-stats">
                                <span className="stat-number">{stats.cursos}</span>
                                <span className="stat-label">activos</span>
                                <span className="stat-change neutral">245 inscritos</span>
                            </div>
                            <h3 className="card-title">Gestionar Cursos</h3>
                            <p className="card-description">Administrar programas académicos</p>
                            <a href="#" className="card-action">
                                Gestionar <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>


                    <div className="management-card" data-module="tareas">
                        <div className="card-icon tasks">
                            <i className="fas fa-tasks"></i>
                        </div>
                        <div className="card-content">
                            <div className="card-stats">
                                <span className="stat-number">{stats.tareas}</span>
                                <span className="stat-label">activas</span>
                                <span className="stat-change neutral">12 completadas</span>
                            </div>
                            <h3 className="card-title">Gestionar Tareas</h3>
                            <p className="card-description">Asignar y supervisar tareas</p>
                            <a href="#" className="card-action">
                                Gestionar <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>


                    <div className="management-card" data-module="inscripciones">
                        <div className="card-icon registrations">
                            <i className="fas fa-user-plus"></i>
                        </div>
                        <div className="card-content">
                            <div className="card-stats">
                                <span className="stat-number">{stats.inscripciones}</span>
                                <span className="stat-label">nuevas</span>
                                <span className="stat-change positive">+18 esta semana</span>
                            </div>
                            <h3 className="card-title">Gestionar Inscripciones</h3>
                            <p className="card-description">Procesar inscripciones y categorizar</p>
                            <a href="#" className="card-action">
                                Gestionar <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>


                    <div className="management-card" data-module="reportes">
                        <div className="card-icon reports">
                            <i className="fas fa-chart-bar"></i>
                        </div>
                        <div className="card-content">
                            <div className="card-stats">
                                <span className="stat-number">{stats.reportes}</span>
                                <span className="stat-label">reportes</span>
                                <span className="stat-change neutral">Actualizado hoy</span>
                            </div>
                            <h3 className="card-title">Gestionar Reportes</h3>
                            <p className="card-description">Generar informes del sistema</p>
                            <a href="#" className="card-action">
                                Gestionar <i className="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
                {seccionActiva === "usuarios" && <Gestionusuarios />}
                {seccionActiva === "solicitudes" && <Gestionsolicitud />}
                {seccionActiva === "eventos" && <Gestionevento />}
                {seccionActiva === "cabanas" && <Gestioncabana />}
                {seccionActiva === "cursos" && <Gestioninscripcion />}
                {seccionActiva === "tareas" && <Gestiontarea />}
                {seccionActiva === "inscripciones" && <Gestioninscripcion />}
                {seccionActiva === "categorias" && <Gestioncategorizacion />}
                {seccionActiva === "reportes" && <Gestionreporte />}
            </main>
            <Footer />
        </>
    );
};

export default Gestion;