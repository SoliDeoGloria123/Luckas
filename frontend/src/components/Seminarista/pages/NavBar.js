import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();
  return (
    <nav className="navbar-luckasent">
      <ul>
        <li className={location.pathname.includes('inicio') ? 'active' : ''}>
          <Link to="/seminarista">Inicio</Link>
        </li>
        <li className={location.pathname.includes('eventos') ? 'active' : ''}>
          <Link to="/dashboard/seminarista/eventos">Eventos</Link>
        </li>
        <li className={location.pathname.includes('cabanas') ? 'active' : ''}>
          <Link to="/dashboard/seminarista/cabanas">Cabañas</Link>
        </li>
        <li className={location.pathname.includes('mis-inscripciones') ? 'active' : ''}>
          <Link to="/dashboard/seminarista/mis-inscripciones">Mis Inscripciones</Link>
        </li>
        <li className={location.pathname.includes('mis-reservas') ? 'active' : ''}>
          <Link to="/dashboard/seminarista/mis-reservas">Mis Reservas</Link>
        </li>
        <li className={location.pathname.includes('mis-solicitudes') ? 'active' : ''}>
          <Link to="/dashboard/seminarista/mis-solicitudes">Mis Solicitudes</Link>
        </li>
        <li className={location.pathname.includes('nueva-solicitud') ? 'active' : ''}>
          <Link to="/dashboard/seminarista/nueva-solicitud">Nueva Solicitud</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
