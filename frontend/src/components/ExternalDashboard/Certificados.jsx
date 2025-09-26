
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Certificados() {
  const [certificados, setCertificados] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    // Consultar actividad del usuario (inscripciones y reservas)
    axios.get(`/api/reportes/actividad-usuarios?usuarioId=${userId}`)
      .then(res => {
        if (res.data.success && res.data.data) {
          // Unificar inscripciones y reservas como certificados descargables
          const inscripciones = res.data.data.inscripciones.datos || [];
          const reservas = res.data.data.reservas.datos || [];
          // Simular certificados por inscripción y reserva
          const certs = [
            ...inscripciones.map(i => ({
              id: i._id,
              tipo: 'Inscripción',
              nombre: i.evento?.name || 'Evento',
              fecha: i.createdAt,
              url: `/api/certificados/inscripcion/${i._id}` // Supuesto endpoint de descarga
            })),
            ...reservas.map(r => ({
              id: r._id,
              tipo: 'Reserva',
              nombre: r.cabana?.nombre || 'Cabaña',
              fecha: r.fechaInicio,
              url: `/api/certificados/reserva/${r._id}` // Supuesto endpoint de descarga
            }))
          ];
          setCertificados(certs);
        }
      })
      .catch(err => {
        console.error('Error al cargar certificados:', err);
      });
  }, [userId]);

  return (
    <section>
      <h2>Certificados</h2>
      <p>Aquí podrás descargar tus certificados de inscripción y participación.</p>
      <ul>
        {certificados.length === 0 ? (
          <li>No tienes certificados disponibles.</li>
        ) : (
          certificados.map(cert => (
            <li key={cert.id}>
              <strong>{cert.tipo}:</strong> {cert.nombre} - {cert.fecha ? new Date(cert.fecha).toLocaleDateString() : ''}
              <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '1em' }}>Descargar</a>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
