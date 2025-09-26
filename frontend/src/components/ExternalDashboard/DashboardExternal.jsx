import React from 'react';
import EventosList from './EventosList';
import ProgramasList from './ProgramasList';
import ReservasCabanas from './ReservasCabanas';
import Certificados from './Certificados';
import UserProfile from './UserProfile';

export default function DashboardExternal() {
  // Aquí se puede agregar lógica de autenticación y routing interno
  return (
    <div id="vanta-bg" style={{ minHeight: '100vh', width: '100vw' }}>
      {/* Header y navegación básica */}
      <header>
        <h1>Bienvenido al Seminario SBC</h1>
        <UserProfile />
      </header>
      <main>
        <EventosList />
        <ProgramasList />
        <ReservasCabanas />
        <Certificados />
      </main>
    </div>
  );
}
