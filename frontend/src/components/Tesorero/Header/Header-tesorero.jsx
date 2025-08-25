import React, { useState } from "react";
import './header.css'


const HeaderTesorero = ({ }) => {
    const [openmenu,setOpenMenu]= useState(false);

    const toogleMenuTesorero = () =>{
        setOpenMenu(!openmenu)
    }
     const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/";
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
                    <a href="/tesorero" className="nav-item-tesorero">Dasbhoard</a>
                    <a href="/tesorero-Gestiones" className="nav-item-tesorero">Gestiones</a>
                    <a href="" className="nav-item-tesorero">Finanzas</a>
                    <a href="" className="nav-item-tesorero">Reportes</a>
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
                            <span className="user-name-tesorero">Steeven</span>
                            <span className="user-role-tesorero">Tesorera</span>
                        </div>
                        <i className="fas fa-chevron-down"></i>


                        {openmenu && (
                            <div className="dropdown-menu-tesorero">
                                <a href="">Mi Perfil</a>
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