import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inscripcionService } from '../../../services/inscripcionService';
import { useAuthCheck } from '../hooks/useAuthCheck';
import './MisInscripciones.css';
import NavBar from './NavBar';
import './estilosDashboard.css';
import EditarInscripcionModal from './EditarInscripcionModal';
import Header from '../Shared/Header';

const MisInscripciones = () => {
  const { user } = useAuthCheck('seminarista');
  const [inscripciones, setInscripciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const data = await inscripcionService.getMisInscripciones();
        let inscripcionesArray = [];
        if (Array.isArray(data)) {
          inscripcionesArray = data;
        } else if (data && Array.isArray(data.inscripciones)) {
          inscripcionesArray = data.inscripciones;
        } else if (data && Array.isArray(data.data)) {
          inscripcionesArray = data.data;
        }
        setInscripciones(inscripcionesArray);
      } catch (err) {
        setError('No se pudieron cargar tus inscripciones.');
      } finally {
        setLoading(false);
      }
    };
    fetchInscripciones();
  }, []);

  return (
    <div className="app-background">
        <Header 
        userRole="seminarista" 
        userName={user?.nombre} 
        breadcrumbPath={['Dashboard', 'Nueva Solicitud']}
        />
      <NavBar />
      <div className="section-container">
        <Link to="/seminarista/dashboard" className="card-btn" style={{marginBottom:'1.5rem',display:'inline-block'}}>← Volver al Dashboard</Link>
        <h2 style={{fontWeight:800, fontSize:'2rem', color:'#a5b4fc'}}>Mis Inscripciones</h2>
        {loading && <p>Cargando inscripciones...</p>}
        {error && <p style={{color:'#f472b6'}}>{error}</p>}
        {!loading && !error && (
          <div className="grid-cards">
            {inscripciones.length === 0 ? (
              <div className="card">No tienes inscripciones.</div>
            ) : (
              inscripciones.map(insc => (
                <div key={insc._id} className="card">
                  <div className="inscripcion-imgbox" style={{width:'100%',textAlign:'center',marginBottom:'1rem'}}>
                    <img
                      src={insc.evento?.imagenUrl || insc.evento?.imagen || '/images/default-inscripcion.svg'}
                      alt={insc.evento?.nombre || 'Evento'}
                      style={{width:'90px',height:'90px',objectFit:'cover',borderRadius:'50%',background:'#23243a'}}
                    />
                  </div>
                  <div className="card-title">Evento: {typeof insc.evento === 'object' ? insc.evento?.nombre || '-' : insc.evento || '-'}</div>
                  <div className="card-subtitle">Estado: {insc.estado}</div>
                  <span style={{color:'#a5b4fc'}}>Fecha: {insc.evento?.fechaEvento ? new Date(insc.evento.fechaEvento).toLocaleDateString() : '-'}</span>
                  <span>Horario: {insc.evento?.horaInicio || '-'} - {insc.evento?.horaFin || '-'}</span>
                  <span style={{color:'#fbbf24',fontWeight:600}}>Precio: {insc.evento?.precio ? `$${insc.evento.precio.toLocaleString()}` : 'Gratis'}</span>
                  <span>Cupos: {insc.evento?.cuposDisponibles ?? '-'} / {insc.evento?.cuposTotales ?? '-'}</span>
                  <span>Lugar: {typeof insc.evento?.lugar === 'object' ? insc.evento?.lugar?.nombre || '-' : insc.evento?.lugar || '-'}</span>
                  <span>Dirección: {insc.evento?.direccion || '-'}</span>
                  <span style={{color:'#38bdf8'}}>{Array.isArray(insc.evento?.etiquetas) ? `Etiquetas: ${insc.evento.etiquetas.map(e => typeof e === 'string' ? e : e?.nombre || '').filter(Boolean).join(', ')}` : ''}</span>
                  <span style={{color:'#f472b6',fontStyle:'italic'}}>{typeof insc.evento?.observaciones === 'object' ? '' : insc.evento?.observaciones}</span>
                  <span style={{fontSize:'0.9em',color:'#a5b4fc'}}>Inscripción realizada: {insc.createdAt ? new Date(insc.createdAt).toLocaleString() : '-'}</span>
                  <span style={{fontSize:'0.9em',color:'#a5b4fc'}}>Última actualización: {insc.updatedAt ? new Date(insc.updatedAt).toLocaleString() : '-'}</span>
                  <button className="card-btn" style={{marginTop:'1rem'}} onClick={() => setEditando(insc)}>Editar</button>
                </div>
              ))
            )}
          </div>
        )}
        {editando && (
          <EditarInscripcionModal
            inscripcion={editando}
            onClose={() => setEditando(null)}
            onSave={async (form) => {
              try {
                await inscripcionService.update(editando._id, { ...editando, ...form });
                setEditando(null);
                // Refrescar inscripciones
                const data = await inscripcionService.getMisInscripciones();
                let inscripcionesArray = [];
                if (Array.isArray(data)) {
                  inscripcionesArray = data;
                } else if (data && Array.isArray(data.inscripciones)) {
                  inscripcionesArray = data.inscripciones;
                } else if (data && Array.isArray(data.data)) {
                  inscripcionesArray = data.data;
                }
                setInscripciones(inscripcionesArray);
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

export default MisInscripciones;
