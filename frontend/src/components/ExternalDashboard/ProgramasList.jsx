
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001');

export default function ProgramasList() {
  const [cursos, setCursos] = useState([]);
  const [programas, setProgramas] = useState([]);

  useEffect(() => {
    // Cargar cursos públicos
    axios.get('/api/cursos/publicos')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setCursos(res.data.data);
        }
      })
      .catch(err => {
        console.error('Error al cargar cursos:', err);
      });
    // Cargar programas técnicos públicos
    axios.get('/api/programas-tecnicos/publicos')
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setProgramas(res.data.data);
        }
      })
      .catch(err => {
        console.error('Error al cargar programas técnicos:', err);
      });

    // Suscribirse a actualizaciones en tiempo real
    socket.on('cursoActualizado', cursoActualizado => {
      setCursos(prev => prev.map(c => c._id === cursoActualizado._id ? cursoActualizado : c));
    });
    socket.on('nuevoCurso', nuevoCurso => {
      setCursos(prev => [...prev, nuevoCurso]);
    });
    socket.on('cursoEliminado', cursoId => {
      setCursos(prev => prev.filter(c => c._id !== cursoId));
    });

    socket.on('programaActualizado', programaActualizado => {
      setProgramas(prev => prev.map(p => p._id === programaActualizado._id ? programaActualizado : p));
    });
    socket.on('nuevoPrograma', nuevoPrograma => {
      setProgramas(prev => [...prev, nuevoPrograma]);
    });
    socket.on('programaEliminado', programaId => {
      setProgramas(prev => prev.filter(p => p._id !== programaId));
    });

    return () => {
      socket.off('cursoActualizado');
      socket.off('nuevoCurso');
      socket.off('cursoEliminado');
      socket.off('programaActualizado');
      socket.off('nuevoPrograma');
      socket.off('programaEliminado');
    };
  }, []);

  return (
    <section>
      <h2>Programas Académicos</h2>
      <ul>
        {cursos.length === 0 && programas.length === 0 ? (
          <li>No hay cursos ni programas técnicos disponibles.</li>
        ) : (
          <>
            {cursos.map(c => (
              <li key={c._id}>
                <strong>Curso:</strong> {c.nombre} - Cupos: {c.cuposDisponibles}
                {/* TODO: Botón para inscribirse y pagar */}
              </li>
            ))}
            {programas.map(p => (
              <li key={p._id}>
                <strong>Programa Técnico:</strong> {p.nombre} - Cupos: {p.cuposDisponibles}
                {/* TODO: Botón para inscribirse y pagar */}
              </li>
            ))}
          </>
        )}
      </ul>
    </section>
  );
}
