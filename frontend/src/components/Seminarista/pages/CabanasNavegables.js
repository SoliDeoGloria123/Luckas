import React, { useEffect, useState } from 'react';
import { cabanaService } from '../../../services/cabanaService';
import { useAuthCheck } from '../hooks/useAuthCheck';
import './CabanasNavegables.css';
import FormularioReserva from './FormularioReserva';
import NavBar from './NavBar';
//import './estilosDashboard.css';
import { Link } from 'react-router-dom';
import Header from '../Shared/Header';

const CabanasNavegables = () => {
  const [cabanas, setCabanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const { user } = useAuthCheck('seminarista');

  useEffect(() => {
    const fetchCabanas = async () => {
      try {
        const data = await cabanaService.getAll();
        let cabanasArray = [];
        if (Array.isArray(data)) {
          cabanasArray = data;
        } else if (data && Array.isArray(data.cabanas)) {
          cabanasArray = data.cabanas;
        } else if (data && Array.isArray(data.data)) {
          cabanasArray = data.data;
        }
        setCabanas(cabanasArray);
      } catch (err) {
        setError('No se pudieron cargar las cabañas.');
      } finally {
        setLoading(false);
      }
    };
    fetchCabanas();
  }, []);

  const handleReservar = (cabana) => {
    setCabanaSeleccionada(cabana);
  };

  return (
    <div className="app-background">
      <Header 
        userRole="seminarista" 
        userName={user?.nombre} 
        breadcrumbPath={['Dashboard', 'Nueva Solicitud']}/>
      <NavBar />
      <div className="section-container">
        <Link to="/seminarista/dashboard" className="card-btn" style={{marginBottom:'1.5rem',display:'inline-block'}}>← Volver al Dashboard</Link>
        <h2 style={{fontWeight:800, fontSize:'2rem', color:'#a5b4fc'}}>Cabañas Disponibles</h2>
        {loading && <p>Cargando cabañas...</p>}
        {error && <p style={{color:'#f472b6'}}>{error}</p>}
        {!loading && !error && (
          <div className="grid-cards">
            {cabanas.length === 0 ? (
              <div className="card">No hay cabañas disponibles.</div>
            ) : (
              cabanas.map(cab => (
                <div key={cab._id} className="card">
                  <div className="cabana-imagen" style={{width:'100%',textAlign:'center',marginBottom:'1rem'}}>
                    <img
                      src={cab.imagenUrl || '/images/default-cabin.svg'}
                      alt={cab.nombre}
                      style={{width:'90px',height:'90px',objectFit:'cover',borderRadius:'50%',background:'#23243a'}}
                    />
                  </div>
                  <div className="card-title">{cab.nombre}</div>
                  <div className="card-subtitle">{cab.descripcion || '-'}</div>
                  <span style={{color:'#fbbf24',fontWeight:600}}>Precio: {cab.precio ? `$${cab.precio}` : '-'}</span>
                  <span>Estado: <b style={{color:cab.estado==='disponible'?'#5eead4':'#f472b6'}}>{cab.estado}</b></span>
                  <span>Cupos: {cab.cuposDisponibles ?? '-'} / {cab.cuposTotales ?? '-'}</span>
                  <span>Ubicación: {typeof cab.ubicacion === 'object' ? cab.ubicacion?.nombre || '-' : cab.ubicacion || '-'}</span>
                  <span style={{color:'#38bdf8'}}>{Array.isArray(cab.etiquetas) ? `Etiquetas: ${cab.etiquetas.map(e => typeof e === 'string' ? e : e?.nombre || '').filter(Boolean).join(', ')}` : ''}</span>
                  <button className="card-btn" onClick={()=>handleReservar(cab)} disabled={cab.estado!=='disponible'}>
                    Reservar
                  </button>
                </div>
              ))
            )}
          </div>
        )}
        {cabanaSeleccionada && (
          <FormularioReserva
            cabana={cabanaSeleccionada}
            onClose={() => setCabanaSeleccionada(null)}
            onSuccess={(msg) => {
              setFeedback(msg);
              setCabanaSeleccionada(null);
              setTimeout(() => setFeedback(null), 3500);
            }}
          />
        )}
        {feedback && (
          <div className="feedback-reserva-exito">{feedback}</div>
        )}
      </div>
    </div>
  );
};

export default CabanasNavegables;
