import React, { useEffect, useState } from 'react';
import { solicitudService } from '../../../services/solicirudService';
import { useAuthCheck } from '../hooks/useAuthCheck';
import './MisSolicitudes.css';
import './estilosDashboard.css';
import Header from '../Shared/Header';
import NavBar from './NavBar';
import { Link } from 'react-router-dom';
import EditarSolicitudModal from './EditarSolicitudModal';

const MisSolicitudes = () => {
  const { user } = useAuthCheck('seminarista'); // <-- Aquí está user

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Debes iniciar sesión para ver tus solicitudes.');
          setLoading(false);
          return;
        }
        const data = await solicitudService.getMisSolicitudes();
        let solicitudesArray = [];
        if (Array.isArray(data)) {
          solicitudesArray = data;
        } else if (data && Array.isArray(data.data)) {
          solicitudesArray = data.data;
        } else if (data && Array.isArray(data.solicitudes)) {
          solicitudesArray = data.solicitudes;
        }
        setSolicitudes(solicitudesArray || []);
      } catch (err) {
        if (err && err.message && err.message.includes('401')) {
          setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else {
          setError('No se pudieron cargar tus solicitudes.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitudes();
  }, []);

  return (
    <div className="app-background">
      <Header 
        userRole="seminarista" 
        userName={user?.nombre}
        breadcrumbPath={['Dashboard', 'Solicitudes']}
      />
      <NavBar />
      <div className="section-container">
        <Link to="/seminarista" className="card-btn" style={{marginBottom:'1.5rem',display:'inline-block'}}>
          ← Volver al Dashboard
        </Link>
        <h2 style={{fontWeight:800, fontSize:'2rem', color:'#a5b4fc'}}>Mis Solicitudes</h2>
        {loading && <p>Cargando solicitudes...</p>}
        {error && <p style={{color:'#f472b6'}}>{error}</p>}
        {!loading && !error && (
          <div className="grid-cards">
            {solicitudes.length === 0 ? (
              <div className="card">No tienes solicitudes.</div>
            ) : (
              solicitudes
                .filter(sol => {
                  if (!user?._id) return false;
                  if (typeof sol.solicitante === 'object') {
                    return sol.solicitante._id === user._id;
                  }
                  return sol.solicitante === user._id;
                })
                .map(sol => (
                  <div key={sol._id} className="card">
                    <div className="cabana-imagen" style={{width:'100%',textAlign:'center',marginBottom:'1rem'}}>
                      <img
                        src={'/images/default-request.svg'}
                        alt={sol.tipo}
                        style={{width:'90px',height:'90px',objectFit:'cover',borderRadius:'50%',background:'#23243a'}}
                      />
                    </div>
                    <div className="card-title">{typeof sol.tipo === 'object' ? JSON.stringify(sol.tipo) : sol.tipo}</div>
                    <div className="card-subtitle">Estado: {sol.estado}</div>
                    <span style={{color:'#a5b4fc'}}>Fecha: {sol.fecha ? new Date(sol.fecha).toLocaleDateString() : '-'}</span>
                    <span style={{color:'#818cf8'}}>Observaciones: {typeof sol.observaciones === 'object' ? '' : sol.observaciones}</span>
                    <span style={{fontSize:'0.9em',color:'#a5b4fc'}}>Solicitud realizada: {sol.createdAt ? new Date(sol.createdAt).toLocaleString() : '-'}</span>
                    <span style={{fontSize:'0.9em',color:'#a5b4fc'}}>Última actualización: {sol.updatedAt ? new Date(sol.updatedAt).toLocaleString() : '-'}</span>
                    <button className="card-btn" style={{marginTop:'1rem'}} onClick={() => setEditando(sol)}>Editar</button>
                  </div>
                ))
            )}
          </div>
        )}
        {editando && (
          <EditarSolicitudModal
            solicitud={editando}
            onClose={() => setEditando(null)}
            onSave={async (form) => {
              try {
                await solicitudService.update(editando._id, { ...editando, ...form });
                setEditando(null);
                const data = await solicitudService.getMisSolicitudes();
                let solicitudesArray = [];
                if (Array.isArray(data)) {
                  solicitudesArray = data;
                } else if (data && Array.isArray(data.data)) {
                  solicitudesArray = data.data;
                } else if (data && Array.isArray(data.solicitudes)) {
                  solicitudesArray = data.solicitudes;
                }
                setSolicitudes(solicitudesArray);
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

export default MisSolicitudes;