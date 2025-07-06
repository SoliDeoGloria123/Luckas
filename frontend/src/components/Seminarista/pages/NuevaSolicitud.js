import React, { useState, useEffect } from 'react';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { solicitudService } from '../../../services/solicirudService';
import { eventService } from '../../../services/eventService';
import { cabanaService } from '../../../services/cabanaService';
import { categorizacionService } from '../../../services/categorizacionService';
import './NuevaSolicitud.css';
import NavBar from './NavBar';
import './estilosDashboard.css';
import { Link } from 'react-router-dom';

const NuevaSolicitud = () => {
  const { user } = useAuthCheck('seminarista');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cabanas, setCabanas] = useState([]);
  const [modeloReferencia, setModeloReferencia] = useState('');
  const [referencia, setReferencia] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [tipoSolicitud, setTipoSolicitud] = useState('');
  const [cantidadPersonas, setCantidadPersonas] = useState('');

  useEffect(() => {
    categorizacionService.getAll().then(res => {
      setCategorias(res.data || res);
    });
    eventService.getAllEvents().then(res => {
      setEventos(res.data || res);
    });
    cabanaService.getAll().then(res => {
      setCabanas(res.data || res);
    });
  }, []);

  const handleModeloReferenciaChange = (e) => {
    setModeloReferencia(e.target.value);
    setReferencia('');
  };

  const handleReferenciaChange = (e) => {
    setReferencia(e.target.value);
  };

  const handleCategoriaChange = (e) => {
    setCategoriaSeleccionada(e.target.value);
  };

  const handleTipoSolicitudChange = (e) => {
    setTipoSolicitud(e.target.value);
    setModeloReferencia('');
    setReferencia('');
  };

  const handleCantidadPersonasChange = (e) => {
    setCantidadPersonas(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    const form = e.target;
    const categoriaObj = categorias.find(cat => cat._id === categoriaSeleccionada);
    let referenciaObj = referencia || undefined;
    const subcategoria = form.subcategoria?.value || undefined;
    const data = {
      solicitante: user?._id,
      responsable: user?._id, // Nuevo campo requerido por el backend
      correo: form.correo.value,
      telefono: form.telefono.value,
      tipoSolicitud: form.tipoSolicitud.value,
      modeloReferencia: modeloReferencia || undefined,
      referencia: referenciaObj,
      categoria: categoriaObj ? categoriaObj._id : undefined,
      subcategoria: subcategoria,
      cantidadPersonas: cantidadPersonas,
      descripcion: form.descripcion.value,
      prioridad: 'Media',
      observaciones: form.observaciones.value
    };
    try {
      await solicitudService.create(data);
      setMsg('¡Solicitud enviada exitosamente!');
      form.reset();
      setModeloReferencia('');
      setReferencia('');
      setCategoriaSeleccionada('');
      setCantidadPersonas('');
    } catch (err) {
      setMsg('Error al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const subcategorias = categorias.filter(cat =>
    categoriaSeleccionada && cat.nombre !== categorias.find(c => c._id === categoriaSeleccionada)?.nombre &&
    cat.nombre.toLowerCase().includes(categorias.find(c => c._id === categoriaSeleccionada)?.nombre?.toLowerCase() || '')
  );

  return (
    <div className="app-background">
      <NavBar />
      <div className="section-container">
        <Link to="/seminarista/dashboard" className="card-btn" style={{marginBottom:'1.5rem',display:'inline-block'}}>← Volver al Dashboard</Link>
        <h2 style={{fontWeight:800, fontSize:'2rem', color:'#a5b4fc'}}>Nueva Solicitud</h2>
        <form onSubmit={handleSubmit} className="form-nueva-solicitud card" style={{width:'100%',maxWidth:'500px',margin:'0 auto',boxShadow:'0 8px 32px 0 #5eead4aa'}}>
          <input type="hidden" name="solicitante" value={user?._id || ''} />
          <label>Correo:</label>
          <input type="email" name="correo" defaultValue={user?.email || ''} required />
          <label>Teléfono:</label>
          <input type="tel" name="telefono" defaultValue={user?.telefono || ''} required />
          <label>Tipo de solicitud:</label>
          <select name="tipoSolicitud" required value={tipoSolicitud} onChange={handleTipoSolicitudChange}>
            <option value="">Selecciona...</option>
            <option value="Inscripción">Inscripción</option>
            <option value="Hospedaje">Hospedaje</option>
            <option value="Alimentación">Alimentación</option>
            <option value="Transporte">Transporte</option>
            <option value="Certificados">Certificados</option>
            <option value="Administrativa">Administrativa</option>
            <option value="Otra">Otra</option>
          </select>
          {/* Mostrar modeloReferencia solo si tipoSolicitud es Inscripción u Hospedaje */}
          {(tipoSolicitud === 'Inscripción' || tipoSolicitud === 'Hospedaje') && (
            <>
              <label>Modelo de Referencia:</label>
              <select name="modeloReferencia" value={modeloReferencia} onChange={handleModeloReferenciaChange} required>
                <option value="">Selecciona...</option>
                <option value="Eventos">Evento</option>
                <option value="Cabana">Cabaña</option>
                <option value="Inscripcion">Inscripción</option>
                <option value="Reserva">Reserva</option>
              </select>
            </>
          )}
          {/* Mostrar referencia según modeloReferencia */}
          {modeloReferencia && (
            <>
              <label>Referencia ({modeloReferencia}):</label>
              <select name="referencia" value={referencia} onChange={handleReferenciaChange} required>
                <option value="">Selecciona...</option>
                {modeloReferencia === 'Eventos' && eventos.map(ev => (
                  <option key={ev._id} value={ev._id}>{ev.nombre}</option>
                ))}
                {modeloReferencia === 'Cabana' && cabanas.map(cb => (
                  <option key={cb._id} value={cb._id}>{cb.nombre}</option>
                ))}
                {/* Puedes agregar más según modeloReferencia */}
              </select>
            </>
          )}
          <label>Categoría:</label>
          <select name="categoria" value={categoriaSeleccionada} onChange={handleCategoriaChange} required>
            <option value="">Selecciona...</option>
            {categorias.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.nombre}</option>
            ))}
          </select>
          {/* Mostrar subcategorías si existen */}
          {subcategorias.length > 0 && (
            <>
              <label>Subcategoría:</label>
              <select name="subcategoria">
                <option value="">Selecciona...</option>
                {subcategorias.map(sub => (
                  <option key={sub._id} value={sub._id}>{sub.nombre}</option>
                ))}
              </select>
            </>
          )}
          <label>Cantidad de personas:</label>
          <input type="number" name="cantidadPersonas" min="1" value={cantidadPersonas} onChange={handleCantidadPersonasChange} placeholder="Ej: 3" required />
          <label>Descripción:</label>
          <textarea name="descripcion" required placeholder="Describe tu solicitud" />
          <input type="hidden" name="prioridad" value="Media" />
          <label>Observaciones (opcional):</label>
          <textarea name="observaciones" placeholder="Observaciones adicionales" />
          <button type="submit" className="card-btn" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
          {msg && <div style={{marginTop:'1rem', color:'#5eead4', fontWeight:600}}>{msg}</div>}
        </form>
      </div>
    </div>
  );
};

export default NuevaSolicitud;
