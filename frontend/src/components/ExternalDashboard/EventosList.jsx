
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001');

export default function EventosList() {
  const [eventos, setEventos] = useState([]);

  // Cargar eventos públicos al montar
  useEffect(() => {
    axios.get('/api/eventos/publicos')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setEventos(res.data.data);
        }
      })
      .catch(err => {
        console.error('Error al cargar eventos:', err);
      });

    // Suscribirse a actualizaciones en tiempo real
    socket.on('eventoActualizado', eventoActualizado => {
      setEventos(prev => prev.map(ev => ev._id === eventoActualizado._id ? eventoActualizado : ev));
    });
    socket.on('nuevoEvento', nuevoEvento => {
      setEventos(prev => [...prev, nuevoEvento]);
    });
    socket.on('eventoEliminado', eventoId => {
      setEventos(prev => prev.filter(ev => ev._id !== eventoId));
    });

    return () => {
      socket.off('eventoActualizado');
      socket.off('nuevoEvento');
      socket.off('eventoEliminado');
    };
  }, []);

  return (
    <section>
      <h2>Eventos Disponibles</h2>
      <ul>
        {eventos.length === 0 ? (
          <li>No hay eventos disponibles.</li>
        ) : (
          eventos.map(ev => (
            <li key={ev._id}>
              <strong>{ev.nombre}</strong> - {new Date(ev.fechaEvento).toLocaleDateString()} - Cupos: {ev.cuposDisponibles}
              {/* TODO: Botón para inscribirse y pagar */}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
