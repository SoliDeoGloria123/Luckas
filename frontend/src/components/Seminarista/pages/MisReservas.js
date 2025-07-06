import React, { useEffect, useState } from 'react';
import { reservaService } from '../../../services/reservaService';
import './MisReservas.css';
import NavBar from './NavBar';
import './estilosDashboard.css';
import { Link } from 'react-router-dom';
import EditarReservaModal from './EditarReservaModal';

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Debes iniciar sesión para ver tus reservas.');
          setLoading(false);
          return;
        }
        const data = await reservaService.getMisReservas();
        let reservasArray = [];
        if (Array.isArray(data)) {
          reservasArray = data;
        } else if (data && Array.isArray(data.data)) {
          reservasArray = data.data;
        } else if (data && Array.isArray(data.reservas)) {
          reservasArray = data.reservas;
        }
        setReservas(reservasArray || []);
      } catch (err) {
        if (err && err.message && err.message.includes('401')) {
          setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else {
          setError('No se pudieron cargar tus reservas.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []);

  return (
    <div className="app-background">
      <NavBar />
      <div className="section-container">
        <Link to="/seminarista/dashboard" className="card-btn" style={{marginBottom:'1.5rem',display:'inline-block'}}>← Volver al Dashboard</Link>
        <h2 style={{fontWeight:800, fontSize:'2rem', color:'#a5b4fc'}}>Mis Reservas</h2>
        {loading && <p>Cargando reservas...</p>}
        {error && <p style={{color:'#f472b6'}}>{error}</p>}
        {!loading && !error && (
          <div className="grid-cards">
            {reservas.length === 0 ? (
              <div className="card">No tienes reservas.</div>
            ) : (
              reservas.map(res => (
                <div key={res._id} className="card">
                  <div className="cabana-imagen" style={{width:'100%',textAlign:'center',marginBottom:'1rem'}}>
                    <img
                      src={res.cabana?.imagenUrl || '/images/default-cabin.svg'}
                      alt={res.cabana?.nombre || 'Cabaña'}
                      style={{width:'90px',height:'90px',objectFit:'cover',borderRadius:'50%',background:'#23243a'}}
                    />
                  </div>
                  <div className="card-title">{typeof res.cabana === 'object' ? res.cabana?.nombre || '-' : res.cabana || '-'}</div>
                  <div className="card-subtitle">Estado: {res.estado}</div>
                  <span style={{color:'#fbbf24',fontWeight:600}}>Precio: {res.precio ? `$${res.precio.toLocaleString()}` : (res.cabana?.precio ? `$${res.cabana.precio.toLocaleString()}` : 'Consultar')}</span>
                  <span>Fecha: {res.fecha ? new Date(res.fecha).toLocaleDateString() : '-'}</span>
                  <span>Cupos: {res.cabana?.cuposDisponibles ?? '-'} / {res.cabana?.cuposTotales ?? '-'}</span>
                  <span>Ubicación: {typeof res.cabana?.ubicacion === 'object' ? res.cabana?.ubicacion?.nombre || '-' : res.cabana?.ubicacion || '-'}</span>
                  <span style={{color:'#38bdf8'}}>{Array.isArray(res.cabana?.etiquetas) ? res.cabana.etiquetas.map(e => typeof e === 'string' ? e : e?.nombre || '').filter(Boolean).join(', ') : ''}</span>
                  <span style={{color:'#f472b6',fontStyle:'italic'}}>{typeof res.observaciones === 'object' ? '' : res.observaciones}</span>
                  <span style={{fontSize:'0.9em',color:'#a5b4fc'}}>Reserva realizada: {res.createdAt ? new Date(res.createdAt).toLocaleString() : '-'}</span>
                  <span style={{fontSize:'0.9em',color:'#a5b4fc'}}>Última actualización: {res.updatedAt ? new Date(res.updatedAt).toLocaleString() : '-'}</span>
                  <button className="card-btn" style={{marginTop:'1rem'}} onClick={() => setEditando(res)}>Editar</button>
                </div>
              ))
            )}
          </div>
        )}
        {editando && (
          <EditarReservaModal
            reserva={editando}
            onClose={() => setEditando(null)}
            onSave={async (form) => {
              try {
                await reservaService.update(editando._id, { ...editando, ...form });
                setEditando(null);
                // Refrescar reservas
                const data = await reservaService.getMisReservas();
                let reservasArray = [];
                if (Array.isArray(data)) {
                  reservasArray = data;
                } else if (data && Array.isArray(data.data)) {
                  reservasArray = data.data;
                } else if (data && Array.isArray(data.reservas)) {
                  reservasArray = data.reservas;
                }
                setReservas(reservasArray);
              } catch (err) {
                alert('Error al guardar cambios');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MisReservas;
