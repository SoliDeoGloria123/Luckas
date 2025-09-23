import React, {useState} from "react";
import './Dashboard.css';
import Sidebar from './Sidebar/Sidebar';
import Header from './Sidebar/Header';

const Perfil = () => {
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [seccionActiva, setSeccionActiva] = useState("dashboard");
    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
            <Sidebar
                sidebarAbierto={sidebarAbierto}
                setSidebarAbierto={setSidebarAbierto}
                seccionActiva={seccionActiva}
                setSeccionActiva={setSeccionActiva}
            />
            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarAbierto ? 'ml-72' : 'ml-20'}`}>
                <Header
                    sidebarAbierto={sidebarAbierto}
                    setSidebarAbierto={setSidebarAbierto}
                    seccionActiva={seccionActiva}
                />
                <div className="main-content-perfil-admin">
                    <div className="">
                        <div className="page-header-perfil-admin ">
                            <h1>Mi Perfil</h1>
                            <p>Administra tu información personal y preferencias de cuenta</p>
                        </div>

                        <div className="profile-grid-perfil-admin ">

                            <div className="profile-card-perfil-admin ">
                                <div className="profile-header-perfil-admin ">
                                    <div className="profile-avatar-section-perfil-admin">
                                        <div className="profile-avatar-perfil-admin large-perfil-admin">S</div>
                                        <button className="avatar-upload-perfil-admin">
                                            <i className="fas fa-camera"></i>
                                        </button>
                                    </div>
                                    <div className="profile-info-perfil-admin">
                                        <h2>Steven Administrador</h2>
                                        <p className="profile-role-perfil-admin">Administrador del Sistema</p>
                                        <p className="profile-status-perfil-admin">
                                            <i className="fas fa-circle status-online-perfil-admin"></i>
                                            En línea
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="config-card-perfil-admin ">
                                <div className="config-header-perfil-admin ">
                                    <i className="fas fa-user"></i>
                                    <h3>Información Personal</h3>
                                </div>
                                <div className="config-content-perfil-admin">
                                    <div className="form-row-perfil-admin ">
                                        <div className="form-group-perfil-admin ">
                                            <label>Nombre</label>
                                            <input type="text" value="Steven" className="form-input-perfil-admin" />
                                        </div>
                                        <div className="form-group-perfil-admin ">
                                            <label>Apellido</label>
                                            <input type="text" value="Administrador" className="form-input-perfil-admin" />
                                        </div>
                                    </div>
                                    <div className="form-group-perfil-admin ">
                                        <label>Correo Electrónico</label>
                                        <input type="email" value="admin@seminariobautista.edu.co" className="form-input-perfil-admin" />
                                    </div>
                                    <div className="form-row-perfil-admin ">
                                        <div className="form-group-perfil-admin ">
                                            <label>Teléfono</label>
                                            <input type="tel" value="+57 311 524 2272" className="form-input-perfil-admin" />
                                        </div>
                                        <div className="form-group-perfil-admin ">
                                            <label>Documento</label>
                                            <input type="text" value="117202027" className="form-input-perfil-admin" />
                                        </div>
                                    </div>
                                    <div className="form-group-perfil-admin ">
                                        <label>Cargo</label>
                                        <input type="text" value="Administrador del Sistema" className="form-input-perfil-admin" />
                                    </div>
                                </div>
                            </div>

                            <div className="config-card-perfil-admin">
                                <div className="config-header-perfil-admin">
                                    <i className="fas fa-lock"></i>
                                    <h3>Seguridad de la Cuenta</h3>
                                </div>
                                <div className="config-content-perfil-admin">
                                    <div className="form-group-perfil-admin ">
                                        <label>Contraseña Actual</label>
                                        <input type="password" className="form-input-perfil-admin" />
                                    </div>
                                    <div className="form-group-perfil-admin ">
                                        <label>Nueva Contraseña</label>
                                        <input type="password" className="form-input-perfil-admin" />
                                    </div>
                                    <div className="form-group-perfil-admin ">
                                        <label>Confirmar Nueva Contraseña</label>
                                        <input type="password" className="form-input-perfil-admin" />
                                    </div>
                                    <div className="security-info">
                                        <div className="security-item">
                                            <i className="fas fa-check-circle text-success"></i>
                                            <span>Autenticación de dos factores activada</span>
                                        </div>
                                        <div className="security-item">
                                            <i className="fas fa-clock text-warning"></i>
                                            <span>Último acceso: Hoy a las 09:30 AM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="config-card-perfil-admin">
                                <div className="config-header-perfil-admin">
                                    <i className="fas fa-palette"></i>
                                    <h3>Preferencias</h3>
                                </div>
                                <div className="config-content-perfil-admin">
                                    <div className="form-group-perfil-admin">
                                        <label>Tema de la Interfaz</label>
                                        <select className="form-input-perfil-admin">
                                            <option>Claro</option>
                                            <option>Oscuro</option>
                                            <option>Automático</option>
                                        </select>
                                    </div>
                                    <div className="form-group-perfil-admin">
                                        <label>Idioma</label>
                                        <select className="form-input-perfil-admin">
                                            <option>Español</option>
                                            <option>English</option>
                                        </select>
                                    </div>
                                    <div className="toggle-group-perfil-admin">
                                        <label>Notificaciones Push</label>
                                        <div className="toggle-switch-perfil-admin">
                                            <input type="checkbox" id="push-notifications" checked />
                                            <label for="push-notifications"></label>
                                        </div>
                                    </div>
                                    <div className="toggle-group-perfil-admin">
                                        <label>Notificaciones por Email</label>
                                        <div className="toggle-switch-perfil-admin">
                                            <input type="checkbox" id="email-prefs" checked />
                                            <label for="email-prefs"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="config-actions-perfil-admin">
                            <button className="btn-perfil-admin btn-primary-perfil-admin">
                                <i className="fas fa-save"></i>
                                Guardar Cambios
                            </button>
                            <button className="btn-perfil-admin btn-outline-perfil-admin">
                                <i className="fas fa-times"></i>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Perfil;