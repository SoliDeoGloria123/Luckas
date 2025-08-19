import React from "react";
import HeaderTesorero from "./Header-tesorero";
import Footer from '../footer/Footer';
import './Gestion.css';

const Gestion = ({ }) => {



    return (
        <>
         <HeaderTesorero />
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
                                <span className="stat-number">156</span>
                                <span className="stat-label">usuarios</span>
                                <span className="stat-change positive">+12 este mes</span>
                            </div>
                            <h3 className="card-title">Gestionar Usuarios</h3>
                            <p className="card-description">Administrar cuentas de usuarios del sistema</p>
                            <a href="seminarista-gestion-usuarios.html" className="card-action">
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
                                <span className="stat-number">23</span>
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
                                <span className="stat-number">8</span>
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
                                <span className="stat-number">12</span>
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
                                <span className="stat-number">15</span>
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
                                <span className="stat-number">34</span>
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
                                <span className="stat-number">67</span>
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
                                <span className="stat-number">25</span>
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
            </main>
             <Footer/>
        </>
    );
};

export default Gestion;