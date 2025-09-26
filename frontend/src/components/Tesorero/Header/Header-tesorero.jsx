import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import './header.css'


const HeaderTesorero = () => {
    const [openmenu, setOpenMenu] = useState(false);
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
    const toogleMenuTesorero = () => {
        setOpenMenu(!openmenu)
    }
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
        <header className="header-tesorero-header">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue:wght@400&display=swap" />
            <div className="header-content-tesorero-header">
                <div className="logo-section-tesorero">
                    <div className="logo-tesorero">
                        <div className="logo-text">
                            <span className="luckas-tesorero">Luckas</span>
                            <span className="logo-subtitle-tesorero">Panel del Tesorero</span>
                        </div>
                    </div>
                </div>

                <nav className="main-nav-tesorero">
                    <a href="/tesorero" className="nav-item-tesorero">Dashboard</a>
                    <a href="/tesorero-Gestiones" className="nav-item-tesorero">Gestiones</a>
                    <a href="" className="nav-item-tesorero">Finanzas</a>
                    <a href="/tesorero/reportes" className="nav-item-tesorero">Reportes</a>
                </nav>

                <div className="header-actions-tesorero">
                    <div className="search-container-tesorero">
                        <i className="fas fa-search search-icon-tesorero"></i>
                        <input type="text" placeholder="Buscar..." className="search-input-tesorero" />
                    </div>
                    <div className="notificacion-tesorero">
                        <i className="fas fa-bell"></i>
                    </div>
                    <div className="user-profile-tesorero" onClick={toogleMenuTesorero}>
                        <div className="user-info-tesorero">
                            <span className="user-name-tesorero">{usuarioLogueado && usuarioLogueado.nombre ? usuarioLogueado.nombre : 'Usuario'}</span>
                            <span className="user-role-tesorero">{usuarioLogueado?.role || "Rol"}</span>
                        </div>
                        <i className="fas fa-chevron-down"></i>

                        {openmenu && (
                            <div className="dropdown-menu-tesorero">
                                <a href="/tesorero/perfil">Mi Perfil</a>
                                <a href="">Configuraciones</a>
                                <button onClick={handleLogout}>
                                    Cerrar Sesion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </header>
    );

};

export default HeaderTesorero