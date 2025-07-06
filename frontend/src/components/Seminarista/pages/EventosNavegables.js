import React, { useEffect, useState } from 'react';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { eventService } from '../../../services/eventService';
import { inscripcionService } from '../../../services/inscripcionService';
import './EventosNavegables.css';
import NavBar from './NavBar';
import './estilosDashboard.css';
import { Link } from 'react-router-dom';
import Header from '../Shared/Header';


const EventosNavegables = () => {
  const { user } = useAuthCheck('seminarista');
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [inscripcionMsg, setInscripcionMsg] = useState(null);
  const [inscripcionLoading, setInscripcionLoading] = useState(false);
  const [misInscripciones, setMisInscripciones] = useState([]);

  useEffect(() => {
    const fetchEventosEInscripciones = async () => {
      try {

        // Cambia getMisInscripciones por getAll (no existe getMisInscripciones en el service)
        const [eventosData, inscripcionesData] = await Promise.all([
          eventService.getAllEvents(),
          inscripcionService.getAll()
        ]);


        let eventosArray = [];
        if (eventosData && Array.isArray(eventosData.data)) {
          eventosArray = eventosData.data;
        } else if (Array.isArray(eventosData)) {
          eventosArray = eventosData;
        } else if (eventosData && Array.isArray(eventosData.eventos)) {
          eventosArray = eventosData.eventos;
        }

        let inscripcionesArray = [];
        if (Array.isArray(inscripcionesData)) {
          inscripcionesArray = inscripcionesData;
        } else if (inscripcionesData && Array.isArray(inscripcionesData.data)) {
          inscripcionesArray = inscripcionesData.data;
        }

        setEventos(eventosArray);
        setMisInscripciones(inscripcionesArray);
      } catch (err) {
        setError('No se pudieron cargar los eventos.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventosEInscripciones();
  }, []);

  const estaInscrito = (eventoId) => {
    return misInscripciones.some(insc => insc.evento === eventoId || insc.evento?._id === eventoId);
  };

  const handleInscribir = (evento) => {
    if (estaInscrito(evento._id)) {
      setInscripcionMsg('Ya estás inscrito en este evento.');
      return;
    }
    setEventoSeleccionado(evento);
  };

  const handleSubmitInscripcion = async (e) => {
    e.preventDefault();
    setInscripcionMsg(null);
    setInscripcionLoading(true);
    const form = e.target;

    try {
      const nuevaInscripcion = {
        usuario: user._id,
        evento: eventoSeleccionado._id,
        categoria: form.categoria.value || eventoSeleccionado.categoria,
        nombre: form.nombre.value,
        apellido: form.apellido.value,
        tipoDocumento: form.tipoDocumento.value,
        numeroDocumento: form.numeroDocumento.value,
        correo: form.correo.value,
        telefono: form.telefono.value,
        edad: parseInt(form.edad.value),
        observaciones: form.observaciones.value || undefined
      };

      const response = await inscripcionService.create(nuevaInscripcion);
      
      // Actualizar la lista de inscripciones
      setMisInscripciones(prev => [...prev, response.data || response]);
      
      setInscripcionMsg('¡Inscripción exitosa!');
      setTimeout(() => {
        setEventoSeleccionado(null);
        setInscripcionMsg(null);
      }, 1800);
    } catch (err) {
      console.error('Error al inscribirse:', err);
      setInscripcionMsg('Error al inscribirse. Intenta de nuevo.');
    } finally {
      setInscripcionLoading(false);
    }
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
        <h2 style={{fontWeight:800, fontSize:'2rem', color:'#a5b4fc'}}>Eventos del Seminario</h2>
        {loading && <p>Cargando eventos...</p>}
        {error && <p style={{color:'#f472b6'}}>{error}</p>}
        {!loading && !error && (
          <div className="grid-cards">
            {eventos.length === 0 ? (
              <div className="card">No hay eventos disponibles.</div>
            ) : (
              eventos.map(ev => {
                const inscrito = estaInscrito(ev._id);
                return (
                  <div key={ev._id} className="card">
                    <div className="evento-imgbox" style={{width:'100%',textAlign:'center',marginBottom:'1rem'}}>
                      <img
                        src={ev.imagenUrl || ev.imagen || '/images/default-event.svg'}
                        alt={ev.nombre || 'Evento sin nombre'}
                        style={{width:'90px',height:'90px',objectFit:'cover',borderRadius:'50%',background:'#23243a'}}
                      />
                    </div>
                    <div className="card-title">{ev.nombre || '-'}</div>
                    <div className="card-subtitle">{ev.descripcion || '-'}</div>
                    <span style={{color:'#fbbf24',fontWeight:600}}>Precio: {ev.precio === 0 ? 'Gratis' : (ev.precio ? `$${ev.precio.toLocaleString()}` : '-')}</span>
                    <span>Categoría: {ev.categoria?.nombre || ev.categoria || '-'}</span>
                    {ev.etiquetas && ev.etiquetas.length > 0 && (
                      <span style={{color:'#38bdf8'}}>Etiquetas: {ev.etiquetas.join(', ')}</span>
                    )}
                    <span>Prioridad: {ev.prioridad || '-'}</span>
                    {ev.observaciones && (
                      <span style={{color:'#f472b6',fontStyle:'italic'}}>Observaciones: {ev.observaciones}</span>
                    )}
                    {inscrito && (
                      <span style={{color:'#5eead4',fontWeight:600}}>✅ Ya estás inscrito</span>
                    )}
                    <button 
                      className={`card-btn ${inscrito ? 'inscrito' : ''}`}
                      onClick={() => handleInscribir(ev)}
                      disabled={inscrito}
                      style={{marginTop:'1rem'}}
                    >
                      {inscrito ? '✓ Inscrito' : 'Inscribirme'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
        {eventoSeleccionado && (
          <div className="modal-inscripcion">
            <div className="modal-content">
              <button className="close-modal" onClick={() => setEventoSeleccionado(null)}>&times;</button>
              <h3>Inscribirse a: {eventoSeleccionado.nombre}</h3>
              <div className="evento-modal-info">
                <strong>Nombre:</strong> {eventoSeleccionado.nombre}<br/>
                <strong>Descripción:</strong> {eventoSeleccionado.descripcion}<br/>
                <strong>Precio:</strong> {eventoSeleccionado.precio === 0 ? 'Gratis' : (eventoSeleccionado.precio ? `$${eventoSeleccionado.precio.toLocaleString()}` : '-')}<br/>
                <strong>Observaciones:</strong> {eventoSeleccionado.observaciones || '-'}
              </div>
              <form onSubmit={handleSubmitInscripcion}>
                <input type="hidden" name="evento" value={eventoSeleccionado._id} />
                <input type="hidden" name="categoria" value={eventoSeleccionado.categoria?._id || eventoSeleccionado.categoria || ''} />
                <label>Nombre:*</label>
                <input type="text" name="nombre" defaultValue={user?.nombre || ''} required />
                <label>Apellido:*</label>
                <input type="text" name="apellido" defaultValue={user?.apellido || ''} required />
                <label>Tipo de documento:*</label>
                <select name="tipoDocumento" required defaultValue="">
                  <option value="">Selecciona...</option>
                  <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                  <option value="Cédula de extranjería">Cédula de extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                </select>
                <label>Número de documento:*</label>
                <input type="text" name="numeroDocumento" defaultValue={user?.numeroDocumento || ''} required />
                <label>Correo:*</label>
                <input type="email" name="correo" defaultValue={user?.email || ''} required />
                <label>Teléfono:*</label>
                <input type="tel" name="telefono" defaultValue={user?.telefono || ''} required />
                <label>Edad:*</label>
                <input type="number" name="edad" min="1" max="120" defaultValue={user?.edad || ''} required />
                <label>Observaciones:</label>
                <textarea name="observaciones" placeholder="¿Algo que quieras agregar?" />
                <button type="submit" className="card-btn" disabled={inscripcionLoading}>
                  {inscripcionLoading ? 'Enviando...' : 'Confirmar inscripción'}
                </button>
                {inscripcionMsg && <div style={{marginTop:'1rem', color:'#5eead4', fontWeight:600}}>{inscripcionMsg}</div>}
              </form>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
  
};

export default EventosNavegables;
