
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001');

export default function ReservasCabanas() {
  const [cabanas, setCabanas] = useState([]);

  useEffect(() => {
    // Cargar cabañas públicas (disponibles)
    axios.get('/api/cabanas/publicas')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setCabanas(res.data.data);
        }
      })
      .catch(err => {
        console.error('Error al cargar cabañas:', err);
      });

    // Suscribirse a actualizaciones en tiempo real
    socket.on('cabanaActualizada', cabanaActualizada => {
      setCabanas(prev => prev.map(c => c._id === cabanaActualizada._id ? cabanaActualizada : c));
    });
    socket.on('nuevaCabana', nuevaCabana => {
      setCabanas(prev => [...prev, nuevaCabana]);
    });
    socket.on('cabanaEliminada', cabanaId => {
      setCabanas(prev => prev.filter(c => c._id !== cabanaId));
    });

    return () => {
      socket.off('cabanaActualizada');
      socket.off('nuevaCabana');
      socket.off('cabanaEliminada');
    };
  }, []);

  return (
    <section>
      <h2>Reservar Cabañas</h2>
      <ul>
        {cabanas.length === 0 ? (
          <li>No hay cabañas disponibles.</li>
        ) : (
          cabanas.map(c => (
            <li key={c._id}>
              <strong>{c.nombre}</strong> - {c.estado === 'disponible' ? 'Disponible' : 'Ocupada'}
              {/* TODO: Botón para reservar */}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
